package compiler

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

const (
	CompileTimeout = 30 * time.Second
	TempDirPrefix  = "latex-resume-"
	TexFile        = "resume.tex"
	PdfFile        = "resume.pdf"
)

type CompileResult struct {
	Success bool
	PDFPath string
	Errors  []string
}

func Compile(latex string) (*CompileResult, error) {
	tempDir, err := os.MkdirTemp("", TempDirPrefix)
	if err != nil {
		return nil, fmt.Errorf("failed to create temp directory: %w", err)
	}

	texPath := filepath.Join(tempDir, TexFile)
	if err := os.WriteFile(texPath, []byte(latex), 0644); err != nil {
		os.RemoveAll(tempDir)
		return nil, fmt.Errorf("failed to write tex file: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), CompileTimeout)
	defer cancel()

	cmd := exec.CommandContext(ctx, "tectonic", "-X", "compile", texPath)
	cmd.Dir = tempDir

	output, err := cmd.CombinedOutput()

	if err != nil {
		errMsg := fmt.Sprintf("compilation failed: %v", err)
		if len(output) > 0 {
			errMsg = fmt.Sprintf("%s\n%s", errMsg, string(output))
		}
		return &CompileResult{
			Success: false,
			Errors:  []string{errMsg},
		}, nil
	}

	pdfPath := filepath.Join(tempDir, PdfFile)
	if _, err := os.Stat(pdfPath); os.IsNotExist(err) {
		return &CompileResult{
			Success: false,
			Errors:  []string{"PDF file was not generated"},
		}, nil
	}

	return &CompileResult{
		Success: true,
		PDFPath: pdfPath,
	}, nil
}

func Cleanup(tempDir string) {
	if tempDir != "" {
		os.RemoveAll(tempDir)
	}
}
