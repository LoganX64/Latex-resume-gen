package websocket

import (
	"bytes"
	"compress/zlib"
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
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
		origins := os.Getenv("ALLOWED_ORIGINS")
		origin := r.Header.Get("Origin")
		for _, o := range strings.Split(origins, ",") {
			if strings.TrimSpace(o) == origin {
				return true
			}
		}
		return false
	},
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

	var writeMu sync.Mutex
	done := make(chan struct{})
	ctx, cancel := context.WithCancel(c.Request.Context())
	defer cancel()

	pingDone := make(chan struct{})
	go func() {
		defer close(pingDone)
		ticker := time.NewTicker(30 * time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-done:
				return
			case <-ticker.C:
				writeMu.Lock()
				err := conn.WriteMessage(websocket.PingMessage, nil)
				writeMu.Unlock()
				if err != nil {
					return
				}
			}
		}
	}()

	readDone := make(chan struct{})
	firstMsg := make(chan struct {
		msgType int
		data    []byte
		err     error
	}, 1)
	go func() {
		defer close(readDone)
		msgType, data, err := conn.ReadMessage()
		firstMsg <- struct {
			msgType int
			data    []byte
			err     error
		}{msgType, data, err}
		if err != nil {
			log.Printf("websocket client disconnected: %v", err)
			cancel()
			return
		}
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				log.Printf("websocket client disconnected: %v", err)
				cancel()
				return
			}
		}
	}()

	first := <-firstMsg
	if first.err != nil {
		log.Printf("websocket read error: %v", first.err)
		cancel()
		return
	}

	var req wsCompileRequest
	if err := json.Unmarshal(first.data, &req); err != nil {
		writeMu.Lock()
		sendErr := sendWSMessage(conn, wsMessage{Type: "error", Message: "Invalid request format"})
		writeMu.Unlock()
		if sendErr != nil {
			log.Printf("websocket send error: %v", sendErr)
		}
		cancel()
		return
	}

	if req.LaTeX == "" {
		writeMu.Lock()
		sendErr := sendWSMessage(conn, wsMessage{Type: "error", Message: "LaTeX content is empty"})
		writeMu.Unlock()
		if sendErr != nil {
			log.Printf("websocket send error: %v", sendErr)
		}
		cancel()
		return
	}

	events := make(chan compiler.CompileEvent)
	start := time.Now()
	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer wg.Done()
		result, err := compiler.CompileWithProgress(ctx, req.LaTeX, req.ProfileImage, events)

		if ctx.Err() != nil {
			log.Printf("compile cancelled: client disconnected")
			if result != nil && result.TempDir != "" {
				compiler.Cleanup(result.TempDir)
			}
			return
		}

		if err != nil {
			log.Printf("compile error: %v", err)
			metrics.CompileRequests.WithLabelValues("error").Inc()
			metrics.CompileDuration.WithLabelValues("error").Observe(time.Since(start).Seconds())
			writeMu.Lock()
			sendErr := sendWSMessage(conn, wsMessage{Type: "error", Message: "Internal compilation error"})
			writeMu.Unlock()
			if sendErr != nil {
				log.Printf("websocket send error: %v", sendErr)
			}
			return
		}
		if result != nil && result.TempDir != "" {
			defer compiler.Cleanup(result.TempDir)
		}
		if result == nil {
			metrics.CompileRequests.WithLabelValues("error").Inc()
			metrics.CompileDuration.WithLabelValues("error").Observe(time.Since(start).Seconds())
			writeMu.Lock()
			sendErr := sendWSMessage(conn, wsMessage{Type: "error", Message: "Compilation failed"})
			writeMu.Unlock()
			if sendErr != nil {
				log.Printf("websocket send error: %v", sendErr)
			}
			return
		}
		if !result.Success {
			return
		}

		pdfData, err := os.ReadFile(result.PDFPath)
		if err != nil {
			log.Printf("failed to read PDF: %v", err)
			metrics.CompileRequests.WithLabelValues("error").Inc()
			metrics.CompileDuration.WithLabelValues("error").Observe(time.Since(start).Seconds())
			writeMu.Lock()
			sendErr := sendWSMessage(conn, wsMessage{Type: "error", Message: "Failed to read compiled PDF"})
			writeMu.Unlock()
			if sendErr != nil {
				log.Printf("websocket send error: %v", sendErr)
			}
			return
		}

		pageCount := countPDFPages(pdfData)

		metrics.CompileRequests.WithLabelValues("success").Inc()
		metrics.CompileDuration.WithLabelValues("success").Observe(time.Since(start).Seconds())

		writeMu.Lock()
		sendErr := sendWSMessage(conn, wsMessage{Type: "complete", PageCount: pageCount})
		if sendErr != nil {
			writeMu.Unlock()
			log.Printf("websocket send error: %v", sendErr)
			return
		}
		conn.SetWriteDeadline(time.Now().Add(60 * time.Second))
		writeErr := conn.WriteMessage(websocket.BinaryMessage, pdfData)
		writeMu.Unlock()
		if writeErr != nil {
			log.Printf("websocket write PDF error: %v", writeErr)
			return
		}
	}()

	for event := range events {
		if ctx.Err() != nil {
			break
		}
		if event.Step == "error" {
			writeMu.Lock()
			sendErr := sendWSMessage(conn, wsMessage{Type: "error", Message: event.Message})
			writeMu.Unlock()
			if sendErr != nil {
				log.Printf("websocket send error: %v", sendErr)
			}
			break
		}
		msg := wsMessage{
			Type:    "progress",
			Step:    event.Step,
			Message: event.Message,
			Output:  event.Output,
		}
		writeMu.Lock()
		sendErr := sendWSMessage(conn, msg)
		writeMu.Unlock()
		if sendErr != nil {
			log.Printf("websocket send error: %v", sendErr)
			break
		}
	}
	wg.Wait()
	cancel()
	close(done)
	<-pingDone
	<-readDone
}

func sendWSMessage(conn *websocket.Conn, msg wsMessage) error {
	conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
	return conn.WriteJSON(msg)
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
