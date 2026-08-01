package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func BasicAuthRequired() gin.HandlerFunc {
	username := os.Getenv("METRICS_USER")
	password := os.Getenv("METRICS_PASS")

	return func(c *gin.Context) {
		u, p, ok := c.Request.BasicAuth()
		if !ok || u != username || p != password {
			c.Header("WWW-Authenticate", `Basic realm="Restricted"`)
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Unauthorized",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
