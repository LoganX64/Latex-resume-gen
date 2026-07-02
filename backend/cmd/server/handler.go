package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type CompileRequest struct {
	LaTeX string `json:"latex" binding:"required"`
}

func compileHandler(c *gin.Context) {
	var req CompileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request: missing latex field",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Compilation endpoint ready",
	})
}
