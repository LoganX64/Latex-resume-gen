package main

import (
	"log"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"latex-resume-backend/internal/handlers"
	"latex-resume-backend/internal/middleware"
	"latex-resume-backend/internal/stats"
	ws "latex-resume-backend/internal/websocket"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus/promhttp"
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
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found: %v", err)
	}

	r := gin.Default()
	r.Use(gin.Recovery())

	// Server config
	serverPort := getEnv("SERVER_PORT", "8080")
	maxRequestSize := getEnvInt("MAX_REQUEST_SIZE_BYTES", 5<<20)

	// CORS config
	originsStr := getEnv("ALLOWED_ORIGINS", "")
	allowedOrigins := strings.Split(originsStr, ",")
	for i := range allowedOrigins {
		allowedOrigins[i] = strings.TrimSpace(allowedOrigins[i])
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
	rateLimitCleanup := getEnvInt("RATE_LIMITER_CLEANUP_SECONDS", 60)
	rateLimitVisitorTTL := getEnvInt("RATE_LIMITER_VISITOR_TTL_SECONDS", 180)
	rateLimitMsg := getEnv("RATE_LIMITER_MSG", "Rate limit exceeded. Try again later.")
	compileLimiter := middleware.NewRateLimiter(float64(rateLimitRPS), rateLimitBurst, rateLimitCleanup, rateLimitVisitorTTL, rateLimitMsg)

	// Stats DB
	statsDBPath := getEnv("STATS_DB_PATH", "/data/stats.db")
	stats.Init(statsDBPath)
	defer stats.Close()

	r.GET("/metrics", middleware.BasicAuthRequired(), gin.WrapH(promhttp.Handler()))

	r.GET("/api/health", func(c *gin.Context) {
		healthy := true

		tectonicStatus := "available"
		if _, err := exec.LookPath("tectonic"); err != nil {
			tectonicStatus = "unavailable"
			healthy = false
		}

		dbStatus := "connected"
		if err := stats.Ping(); err != nil {
			dbStatus = "disconnected"
			healthy = false
		}

		status := http.StatusOK
		if !healthy {
			status = http.StatusServiceUnavailable
		}

		c.JSON(status, gin.H{
			"status":   map[bool]string{true: "ok", false: "degraded"}[healthy],
			"tectonic": tectonicStatus,
			"database": dbStatus,
		})
	})

	r.POST("/api/compile", middleware.APIKeyRequired(), compileLimiter.Middleware(), handlers.CompileHandler)
	r.GET("/api/compile/ws", middleware.APIKeyRequired(), compileLimiter.Middleware(), ws.HandleCompileWS)

	// Stats routes
	r.POST("/api/stats/visit", handlers.RecordVisit)
	r.POST("/api/stats/download", handlers.RecordDownload)
	r.GET("/api/stats", handlers.GetStats)
	r.GET("/api/stats/dashboard", middleware.AdminKeyRequired(), handlers.GetStats)

	// pprof (opt-in via PPROF_ENABLED=true)
	if os.Getenv("PPROF_ENABLED") == "true" {
		pprofPort := getEnv("PPROF_PORT", "6060")
		go func() {
			log.Printf("pprof listening on localhost:%s", pprofPort)
			if err := http.ListenAndServe("localhost:"+pprofPort, nil); err != nil {
				log.Printf("pprof server failed: %v", err)
			}
		}()
	}

	r.Run(":" + serverPort)
}
