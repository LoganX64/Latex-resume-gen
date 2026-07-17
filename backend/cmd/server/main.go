package main

import (
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"latex-resume-backend/internal/handlers"
	"latex-resume-backend/internal/middleware"
	"latex-resume-backend/internal/stats"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if val := os.Getenv(key); val != "" {
		if i, err := strconv.Atoi(val); err == nil {
			return i
		}
	}
	return fallback
}

func main() {
	r := gin.Default()
	r.Use(gin.Recovery())

	// Server config
	serverPort := getEnv("SERVER_PORT", "8080")
	maxRequestSize := getEnvInt("MAX_REQUEST_SIZE_BYTES", 5<<20)

	// CORS config
	allowedOrigins := []string{
		"http://localhost:5173",
		"http://127.0.0.1:5173",
		"http://localhost:4173",
		"http://127.0.0.1:4173",
	}
	if origins := os.Getenv("ALLOWED_ORIGINS"); origins != "" {
		allowedOrigins = strings.Split(origins, ",")
		for i := range allowedOrigins {
			allowedOrigins[i] = strings.TrimSpace(allowedOrigins[i])
		}
	}

	corsMaxAge := 12 * time.Hour
	if maxAge := os.Getenv("CORS_MAX_AGE"); maxAge != "" {
		if d, err := time.ParseDuration(maxAge); err == nil {
			corsMaxAge = d
		}
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: false,
		MaxAge:           corsMaxAge,
	}))

	r.Use(func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, int64(maxRequestSize))
		c.Next()
	})

	r.MaxMultipartMemory = int64(maxRequestSize)

	// Rate limiting config
	rateLimitRPS := getEnvInt("RATE_LIMIT_RPS", 5)
	rateLimitBurst := getEnvInt("RATE_LIMIT_BURST", 10)
	compileLimiter := middleware.NewRateLimiter(float64(rateLimitRPS), rateLimitBurst)

	// Stats DB
	statsDBPath := getEnv("STATS_DB_PATH", "/data/stats.db")
	stats.Init(statsDBPath)
	defer stats.Close()

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.POST("/api/compile", compileLimiter.Middleware(), handlers.CompileHandler)

	// Stats routes
	r.POST("/api/stats/visit", handlers.RecordVisit)
	r.POST("/api/stats/download", handlers.RecordDownload)
	r.GET("/api/stats", handlers.GetStats)
	r.GET("/api/stats/dashboard", middleware.AdminKeyRequired(), handlers.GetStats)

	r.Run(":" + serverPort)
}
