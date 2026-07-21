package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	CompileRequests = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "latex_compile_requests_total",
			Help: "Total number of compile requests",
		},
		[]string{"status"},
	)

	CompileDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "latex_compile_duration_seconds",
			Help:    "Duration of compile requests in seconds",
			Buckets: []float64{0.5, 1, 2, 5, 10, 30, 60},
		},
		[]string{"status"},
	)

	StatsVisits = promauto.NewCounter(
		prometheus.CounterOpts{
			Name: "latex_stats_visits_total",
			Help: "Total number of recorded visits",
		},
	)

	StatsDownloads = promauto.NewCounter(
		prometheus.CounterOpts{
			Name: "latex_stats_downloads_total",
			Help: "Total number of recorded downloads",
		},
	)
)
