package websocket

import (
	"bytes"
	"compress/zlib"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"sync"
	"time"

	"latex-resume-backend/internal/compiler"
	"latex-resume-backend/internal/metrics"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		allowed := map[string]bool{
			"http://localhost:5173":  true,
			"http://127.0.0.1:5173": true,
			"http://localhost:4173":  true,
			"http://127.0.0.1:4173": true,
		}
		if origins := os.Getenv("ALLOWED_ORIGINS"); origins != "" {
			for _, o := range splitOrigins(origins) {
				allowed[o] = true
			}
		}
		return allowed[r.Header.Get("Origin")]
	},
}

func splitOrigins(s string) []string {
	result := make([]string, 0)
	start := 0
	for i := 0; i <= len(s)-1; i++ {
		if s[i] == ',' {
			trimmed := trimSpace(s[start:i])
			if trimmed != "" {
				result = append(result, trimmed)
			}
			start = i + 1
		}
	}
	trimmed := trimSpace(s[start:])
	if trimmed != "" {
		result = append(result, trimmed)
	}
	return result
}

func trimSpace(s string) string {
	start, end := 0, len(s)
	for start < end && s[start] == ' ' {
		start++
	}
	for end > start && s[end-1] == ' ' {
		end--
	}
	return s[start:end]
}

type wsCompileRequest struct {
	LaTeX        string `json:"latex"`
	ProfileImage string `json:"profileImage"`
}

type wsMessage struct {
	Type      string `json:"type"`
	Step      string `json:"step,omitempty"`
	Message   string `json:"message,omitempty"`
	PageCount int    `json:"pageCount,omitempty"`
	Output    string `json:"output,omitempty"`
}

var pdfPagePattern = regexp.MustCompile(`/Type\s*/Page\b`)

func HandleCompileWS(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("websocket upgrade failed: %v", err)
		return
	}
	defer conn.Close()

	conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	conn.SetPongHandler(func(string) error {
		conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	go func() {
		ticker := time.NewTicker(30 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}()

	_, msgBytes, err := conn.ReadMessage()
	if err != nil {
		log.Printf("websocket read error: %v", err)
		return
	}

	var req wsCompileRequest
	if err := json.Unmarshal(msgBytes, &req); err != nil {
		sendWSMessage(conn, wsMessage{Type: "error", Message: "Invalid request format"})
		return
	}

	if req.LaTeX == "" {
		sendWSMessage(conn, wsMessage{Type: "error", Message: "LaTeX content is empty"})
		return
	}

	events := make(chan compiler.CompileEvent)
	start := time.Now()
	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer wg.Done()
		result, err := compiler.CompileWithProgress(req.LaTeX, req.ProfileImage, events)
		if err != nil {
			log.Printf("compile error: %v", err)
			metrics.CompileRequests.WithLabelValues("error").Inc()
			metrics.CompileDuration.WithLabelValues("error").Observe(time.Since(start).Seconds())
			sendWSMessage(conn, wsMessage{Type: "error", Message: "Internal compilation error"})
			return
		}
		if result != nil && result.TempDir != "" {
			defer compiler.Cleanup(result.TempDir)
		}
		if result == nil || !result.Success {
			errMsg := "Compilation failed"
			if result != nil && len(result.Errors) > 0 {
				errMsg = result.Errors[0]
			}
			metrics.CompileRequests.WithLabelValues("error").Inc()
			metrics.CompileDuration.WithLabelValues("error").Observe(time.Since(start).Seconds())
			sendWSMessage(conn, wsMessage{Type: "error", Message: errMsg})
			return
		}

		pdfData, err := os.ReadFile(result.PDFPath)
		if err != nil {
			log.Printf("failed to read PDF: %v", err)
			metrics.CompileRequests.WithLabelValues("error").Inc()
			metrics.CompileDuration.WithLabelValues("error").Observe(time.Since(start).Seconds())
			sendWSMessage(conn, wsMessage{Type: "error", Message: "Failed to read compiled PDF"})
			return
		}

		pageCount := countPDFPages(pdfData)

		metrics.CompileRequests.WithLabelValues("success").Inc()
		metrics.CompileDuration.WithLabelValues("success").Observe(time.Since(start).Seconds())

		sendWSMessage(conn, wsMessage{Type: "complete", PageCount: pageCount})

		if err := conn.WriteMessage(websocket.BinaryMessage, pdfData); err != nil {
			log.Printf("websocket write PDF error: %v", err)
		}
	}()

	for event := range events {
		if event.Step == "error" {
			sendWSMessage(conn, wsMessage{Type: "error", Message: event.Message})
			return
		}
		msg := wsMessage{
			Type:    "progress",
			Step:    event.Step,
			Message: event.Message,
			Output:  event.Output,
		}
		sendWSMessage(conn, msg)
	}
	wg.Wait()
}

func sendWSMessage(conn *websocket.Conn, msg wsMessage) {
	conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
	conn.WriteJSON(msg)
}

func countPDFPages(pdfData []byte) int {
	count := len(pdfPagePattern.FindAll(pdfData, -1))
	for _, stream := range inflatePDFStreams(pdfData) {
		count += len(pdfPagePattern.FindAll(stream, -1))
	}
	if count == 0 {
		return 1
	}
	return count
}

func inflatePDFStreams(pdfData []byte) [][]byte {
	streams := make([][]byte, 0)
	cursor := 0

	for {
		streamStart := bytes.Index(pdfData[cursor:], []byte("stream"))
		if streamStart == -1 {
			break
		}
		streamStart += cursor

		headerStart := streamStart - 512
		if headerStart < 0 {
			headerStart = 0
		}
		header := pdfData[headerStart:streamStart]
		if !bytes.Contains(header, []byte("/FlateDecode")) {
			cursor = streamStart + len("stream")
			continue
		}

		dataStart := streamStart + len("stream")
		if dataStart < len(pdfData) && pdfData[dataStart] == '\r' {
			dataStart++
		}
		if dataStart < len(pdfData) && pdfData[dataStart] == '\n' {
			dataStart++
		}

		streamEnd := bytes.Index(pdfData[dataStart:], []byte("endstream"))
		if streamEnd == -1 {
			break
		}
		streamEnd += dataStart
		raw := bytes.TrimRight(pdfData[dataStart:streamEnd], "\r\n")

		reader, err := zlib.NewReader(bytes.NewReader(raw))
		if err == nil {
			if inflated, readErr := io.ReadAll(reader); readErr == nil {
				streams = append(streams, inflated)
			}
			reader.Close()
		}

		cursor = streamEnd + len("endstream")
	}

	return streams
}
