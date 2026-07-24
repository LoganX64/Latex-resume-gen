package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

type visitor struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

type RateLimiter struct {
	visitors        map[string]*visitor
	mu              sync.Mutex
	rate            rate.Limit
	burst           int
	cleanupInterval time.Duration
	visitorTTL      time.Duration
	errorMsg        string
}

func NewRateLimiter(rps float64, burst int, cleanupSeconds int, visitorTTLSeconds int, msg string) *RateLimiter {
	rl := &RateLimiter{
		visitors:        make(map[string]*visitor),
		rate:            rate.Limit(rps),
		burst:           burst,
		cleanupInterval: time.Duration(cleanupSeconds) * time.Second,
		visitorTTL:      time.Duration(visitorTTLSeconds) * time.Second,
		errorMsg:        msg,
	}
	go rl.cleanup()
	return rl
}

func (rl *RateLimiter) getVisitor(ip string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	v, exists := rl.visitors[ip]
	if !exists {
		limiter := rate.NewLimiter(rl.rate, rl.burst)
		rl.visitors[ip] = &visitor{limiter: limiter, lastSeen: time.Now()}
		return limiter
	}
	v.lastSeen = time.Now()
	return v.limiter
}

func (rl *RateLimiter) cleanup() {
	for {
		time.Sleep(rl.cleanupInterval)
		rl.mu.Lock()
		for ip, v := range rl.visitors {
			if time.Since(v.lastSeen) > rl.visitorTTL {
				delete(rl.visitors, ip)
			}
		}
		rl.mu.Unlock()
	}
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		limiter := rl.getVisitor(ip)
		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"message": rl.errorMsg,
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
