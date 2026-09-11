package middleware

import (
	"crypto/subtle"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func APIKeyRequired() gin.HandlerFunc {
	apiKey := os.Getenv("COMPILE_API_KEY")

	return func(c *gin.Context) {
		key := c.GetHeader("X-API-Key")
		if key == "" {
			key = c.Query("key")
		}
		if key == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Missing API key",
			})
			c.Abort()
			return
		}

		if subtle.ConstantTimeCompare([]byte(key), []byte(apiKey)) != 1 {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid API key",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
