package handlers

import (
	"net/http"

	"latex-resume-backend/internal/metrics"
	"latex-resume-backend/internal/stats"

	"github.com/gin-gonic/gin"
)

func RecordVisit(c *gin.Context) {
	newCount, err := stats.Increment("visits")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to record visit",
		})
		return
	}

	metrics.StatsVisits.Inc()

	c.JSON(http.StatusOK, gin.H{
		"visits": newCount,
	})
}

func RecordDownload(c *gin.Context) {
	newCount, err := stats.Increment("downloads")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to record download",
		})
		return
	}

	metrics.StatsDownloads.Inc()

	c.JSON(http.StatusOK, gin.H{
		"downloads": newCount,
	})
}

func GetStats(c *gin.Context) {
	visits, downloads, err := stats.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to retrieve stats",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"visits":    visits,
		"downloads": downloads,
	})
}
