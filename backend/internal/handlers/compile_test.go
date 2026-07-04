package handlers

import (
	"bytes"
	"compress/zlib"
	"testing"
)

func TestCountPDFPagesFindsCompressedPageObjects(t *testing.T) {
	var compressed bytes.Buffer
	writer := zlib.NewWriter(&compressed)
	if _, err := writer.Write([]byte("1 0 obj\n<< /Type /Page /Parent 2 0 R >>\nendobj")); err != nil {
		t.Fatalf("write compressed stream: %v", err)
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("close compressed stream: %v", err)
	}

	pdf := append([]byte("%PDF-1.5\n3 0 obj\n<< /Filter /FlateDecode >>\nstream\n"), compressed.Bytes()...)
	pdf = append(pdf, []byte("\nendstream\nendobj\n")...)

	if got := countPDFPages(pdf); got != 1 {
		t.Fatalf("countPDFPages() = %d, want 1", got)
	}
}
