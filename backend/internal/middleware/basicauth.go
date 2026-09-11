package middleware

import (
	"crypto/subtle"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func BasicAuthRequired() gin.HandlerFunc {
	username := os.Getenv("METRICS_USER")
	password := os.Getenv("METRICS_PASS")

	return func(c *gin.Context) {
		u, p, ok := c.Request.BasicAuth()
		if !ok || subtle.ConstantTimeCompare([]byte(u), []byte(username)) != 1 || subtle.ConstantTimeCompare([]byte(p), []byte(password)) != 1 {
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
