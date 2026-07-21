package handlers

import (
	"bytes"
	"compress/zlib"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"latex-resume-backend/internal/compiler"
	"latex-resume-backend/internal/metrics"

	"github.com/gin-gonic/gin"
)

type CompileRequest struct {
	LaTeX        string `json:"latex" binding:"required"`
	ProfileImage string `json:"profileImage,omitempty"`
	Mode         string `json:"mode,omitempty"`
}

type CompileErrorResponse struct {
	Success bool     `json:"success"`
	Message string   `json:"message"`
	Errors  []string `json:"errors"`
}

var pdfPagePattern = regexp.MustCompile(`/Type\s*/Page\b`)

func CompileHandler(c *gin.Context) {
	start := time.Now()

	var req CompileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		if strings.Contains(err.Error(), "http: request body too large") {
			c.JSON(http.StatusRequestEntityTooLarge, CompileErrorResponse{
				Success: false,
				Message: "Invalid request: payload is too large",
			})
			return
		}
		c.JSON(http.StatusBadRequest, CompileErrorResponse{
			Success: false,
			Message: "Invalid request: missing latex field",
		})
		return
	}

	if req.Mode == "" {
		req.Mode = c.Query("mode")
	}

	if len(req.LaTeX) == 0 {
		c.JSON(http.StatusBadRequest, CompileErrorResponse{
			Success: false,
			Message: "Invalid request: latex content is empty",
		})
		return
	}

	result, err := compiler.Compile(req.LaTeX, req.ProfileImage)

	// Set up deferred cleanup of the temporary directory (if it was created)
	// to avoid resource leaks under all circumstances.
	defer func() {
		if result != nil && result.TempDir != "" {
			compiler.Cleanup(result.TempDir)
		}
	}()

	if err != nil {
		log.Printf("compile error: %v", err)
		metrics.CompileRequests.WithLabelValues("error").Inc()
		metrics.CompileDuration.WithLabelValues("error").Observe(time.Since(start).Seconds())
		c.JSON(http.StatusInternalServerError, CompileErrorResponse{
			Success: false,
			Message: "Internal compilation error",
			Errors:  []string{err.Error()},
		})
		return
	}

	if !result.Success {
		log.Printf("latex compilation failed: %v", result.Errors)
		metrics.CompileRequests.WithLabelValues("error").Inc()
		metrics.CompileDuration.WithLabelValues("error").Observe(time.Since(start).Seconds())
		c.JSON(http.StatusUnprocessableEntity, CompileErrorResponse{
			Success: false,
			Message: "LaTeX compilation failed",
			Errors:  result.Errors,
		})
		return
	}

	pdfData, err := os.ReadFile(result.PDFPath)
	if err != nil {
		log.Printf("failed to read PDF: %v", err)
		metrics.CompileRequests.WithLabelValues("error").Inc()
		metrics.CompileDuration.WithLabelValues("error").Observe(time.Since(start).Seconds())
		c.JSON(http.StatusInternalServerError, CompileErrorResponse{
			Success: false,
			Message: "Failed to read compiled PDF",
			Errors:  []string{err.Error()},
		})
		return
	}

	pageCount := countPDFPages(pdfData)

	metrics.CompileRequests.WithLabelValues("success").Inc()
	metrics.CompileDuration.WithLabelValues("success").Observe(time.Since(start).Seconds())

	c.Header("Content-Type", "application/pdf")
	c.Header("X-PDF-Page-Count", strconv.Itoa(pageCount))
	if req.Mode == "inline" {
		c.Header("Content-Disposition", "inline; filename=resume.pdf")
	} else {
		c.Header("Content-Disposition", "attachment; filename=resume.pdf")
	}
	c.Data(http.StatusOK, "application/pdf", pdfData)
}

func countPDFPages(pdfData []byte) int {
	count := countPageMarkers(pdfData)
	for _, stream := range inflatePDFStreams(pdfData) {
		count += countPageMarkers(stream)
	}
	if count == 0 {
		return 1
	}
	return count
}

func countPageMarkers(data []byte) int {
	return len(pdfPagePattern.FindAll(data, -1))
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
