package compiler

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

const (
	CompileTimeout = 120 * time.Second
	TempDirPrefix  = "latex-resume-"
	TexFile        = "resume.tex"
	PdfFile        = "resume.pdf"
)

type CompileResult struct {
	Success bool
	PDFPath string
	TempDir string
	Errors  []string
}

func Compile(latex string, profileImageBase64 string) (*CompileResult, error) {
	if _, err := exec.LookPath("tectonic"); err != nil {
		return nil, fmt.Errorf("tectonic is not installed or not in PATH. Install it via: choco install tectonic")
	}

	tempDir, err := os.MkdirTemp("", TempDirPrefix)
	if err != nil {
		return nil, fmt.Errorf("failed to create temp directory: %w", err)
	}

	// Write base64 profile image if provided
	if len(profileImageBase64) > 0 {
		base64Data := profileImageBase64
		if strings.Contains(base64Data, ",") {
			parts := strings.SplitN(base64Data, ",", 2)
			base64Data = parts[1]
		}
		imgData, err := base64.StdEncoding.DecodeString(base64Data)
		if err != nil {
			return &CompileResult{
				Success: false,
				TempDir: tempDir,
				Errors:  []string{fmt.Sprintf("failed to decode profile image base64: %v", err)},
			}, nil
		}
		imgPath := filepath.Join(tempDir, "profile.png")
		if err := os.WriteFile(imgPath, imgData, 0644); err != nil {
			return &CompileResult{
				Success: false,
				TempDir: tempDir,
				Errors:  []string{fmt.Sprintf("failed to write transient profile image file: %v", err)},
			}, nil
		}
	}

	texPath := filepath.Join(tempDir, TexFile)
	if err := os.WriteFile(texPath, []byte(latex), 0644); err != nil {
		os.RemoveAll(tempDir)
		return nil, fmt.Errorf("failed to write tex file: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), CompileTimeout)
	defer cancel()

	cmd := exec.CommandContext(ctx, "tectonic", "-X", "compile", "--untrusted", texPath)
	cmd.Dir = tempDir

	output, err := cmd.CombinedOutput()

	if err != nil {
		errMsg := fmt.Sprintf("compilation failed: %v", err)
		if len(output) > 0 {
			errMsg = fmt.Sprintf("%s\n%s", errMsg, string(output))
		}
		return &CompileResult{
			Success: false,
			TempDir: tempDir,
			Errors:  []string{errMsg},
		}, nil
	}

	pdfPath := filepath.Join(tempDir, PdfFile)
	if _, err := os.Stat(pdfPath); os.IsNotExist(err) {
		return &CompileResult{
			Success: false,
			TempDir: tempDir,
			Errors:  []string{"PDF file was not generated"},
		}, nil
	}

	return &CompileResult{
		Success: true,
		PDFPath: pdfPath,
		TempDir: tempDir,
	}, nil
}

func Cleanup(tempDir string) {
	if tempDir != "" {
		os.RemoveAll(tempDir)
	}
}
