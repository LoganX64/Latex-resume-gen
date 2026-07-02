package main

import (
	"net/http"
	"os"
	"path/filepath"

	"latex-resume-backend/internal/compiler"

	"github.com/gin-gonic/gin"
)

type CompileRequest struct {
	LaTeX string `json:"latex" binding:"required"`
}

type CompileErrorResponse struct {
	Success bool     `json:"success"`
	Message string   `json:"message"`
	Errors  []string `json:"errors"`
}

func compileHandler(c *gin.Context) {
	var req CompileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, CompileErrorResponse{
			Success: false,
			Message: "Invalid request: missing latex field",
		})
		return
	}

	if len(req.LaTeX) == 0 {
		c.JSON(http.StatusBadRequest, CompileErrorResponse{
			Success: false,
			Message: "Invalid request: latex content is empty",
		})
		return
	}

	result, err := compiler.Compile(req.LaTeX)
	if err != nil {
		c.JSON(http.StatusInternalServerError, CompileErrorResponse{
			Success: false,
			Message: "Internal compilation error",
			Errors:  []string{err.Error()},
		})
		return
	}

	if !result.Success {
		c.JSON(http.StatusUnprocessableEntity, CompileErrorResponse{
			Success: false,
			Message: "LaTeX compilation failed",
			Errors:  result.Errors,
		})
		return
	}

	defer func() {
		if result.PDFPath != "" {
			tempDir := filepath.Dir(result.PDFPath)
			compiler.Cleanup(tempDir)
		}
	}()

	pdfData, err := os.ReadFile(result.PDFPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, CompileErrorResponse{
			Success: false,
			Message: "Failed to read compiled PDF",
			Errors:  []string{err.Error()},
		})
		return
	}

	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", "attachment; filename=resume.pdf")
	c.Data(http.StatusOK, "application/pdf", pdfData)
}
