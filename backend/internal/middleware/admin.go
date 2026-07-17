package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func AdminKeyRequired() gin.HandlerFunc {
	adminKey := os.Getenv("ADMIN_KEY")
	if adminKey == "" {
		adminKey = "changeme"
	}

	return func(c *gin.Context) {
		key := c.GetHeader("X-Admin-Key")
		if key == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Missing admin key",
			})
			c.Abort()
			return
		}

		if key != adminKey {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid admin key",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
