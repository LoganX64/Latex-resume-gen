package compiler

import (
	"bufio"
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

type CompileEvent struct {
	Step    string
	Message string
	Output  string
}

const (
	TempDirPrefix = "latex-resume-"
	TexFile       = "resume.tex"
	PdfFile       = "resume.pdf"
)

func getCompileTimeout() time.Duration {
	defaultTimeout := 120 * time.Second
	if val := os.Getenv("COMPILE_TIMEOUT_SECONDS"); val != "" {
		if seconds, err := strconv.Atoi(val); err == nil {
			return time.Duration(seconds) * time.Second
		}
	}
	return defaultTimeout
}

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

	ctx, cancel := context.WithTimeout(context.Background(), getCompileTimeout())
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

func CompileWithProgress(ctx context.Context, latex string, profileImageBase64 string, events chan<- CompileEvent) (*CompileResult, error) {
	defer close(events)

	if _, err := exec.LookPath("tectonic"); err != nil {
		return nil, fmt.Errorf("tectonic is not installed or not in PATH")
	}

	sendEvent := func(e CompileEvent) bool {
		select {
		case events <- e:
			return true
		case <-ctx.Done():
			return false
		}
	}

	if !sendEvent(CompileEvent{Step: "validating", Message: "Validating LaTeX..."}) {
		return nil, ctx.Err()
	}

	tempDir, err := os.MkdirTemp("", TempDirPrefix)
	if err != nil {
		return nil, fmt.Errorf("failed to create temp directory: %w", err)
	}

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
				Errors:  []string{fmt.Sprintf("failed to write profile image: %v", err)},
			}, nil
		}
	}

	if !sendEvent(CompileEvent{Step: "writing", Message: "Writing files..."}) {
		os.RemoveAll(tempDir)
		return nil, ctx.Err()
	}

	texPath := filepath.Join(tempDir, TexFile)
	if err := os.WriteFile(texPath, []byte(latex), 0644); err != nil {
		os.RemoveAll(tempDir)
		return nil, fmt.Errorf("failed to write tex file: %w", err)
	}

	if !sendEvent(CompileEvent{Step: "compiling", Message: "Compiling with Tectonic..."}) {
		os.RemoveAll(tempDir)
		return nil, ctx.Err()
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, getCompileTimeout())
	defer cancel()

	cmd := exec.CommandContext(timeoutCtx, "tectonic", "-X", "compile", "--untrusted", texPath)
	cmd.Dir = tempDir

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		os.RemoveAll(tempDir)
		return nil, fmt.Errorf("failed to create stdout pipe: %w", err)
	}

	if err := cmd.Start(); err != nil {
		os.RemoveAll(tempDir)
		return nil, fmt.Errorf("failed to start tectonic: %w", err)
	}

	scanner := bufio.NewScanner(stdout)
	for scanner.Scan() {
		if ctx.Err() != nil {
			cmd.Process.Kill()
			cmd.Wait()
			os.RemoveAll(tempDir)
			return nil, ctx.Err()
		}
		line := scanner.Text()
		if line != "" {
			sendEvent(CompileEvent{Step: "compiling", Message: "Compiling...", Output: line})
		}
	}

	if err := cmd.Wait(); err != nil {
		if ctx.Err() != nil {
			os.RemoveAll(tempDir)
			return nil, ctx.Err()
		}
		errMsg := fmt.Sprintf("compilation failed: %v", err)
		sendEvent(CompileEvent{Step: "error", Message: errMsg})
		return &CompileResult{
			Success: false,
			TempDir: tempDir,
			Errors:  []string{errMsg},
		}, nil
	}

	if !sendEvent(CompileEvent{Step: "reading", Message: "Reading PDF..."}) {
		os.RemoveAll(tempDir)
		return nil, ctx.Err()
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
