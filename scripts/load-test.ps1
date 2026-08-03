# Load test script for generating demo traffic
# Usage: .\scripts\load-test.ps1

$baseUrl = "http://localhost:8080"
$apiKey = "demo-key-for-recording"
$latexPayload = '{"latex":"\\documentclass{article}\\begin{document}Hello World\\end{document}"}'

Write-Host "=== Starting load test ===" -ForegroundColor Cyan

Write-Host "[1/4] Sending compile requests..." -ForegroundColor Yellow
for ($i = 1; $i -le 20; $i++) {
    try {
        $resp = Invoke-WebRequest -Uri "$baseUrl/api/compile" -Method Post -ContentType "application/json" -Body $latexPayload -Headers @{"X-API-Key"=$apiKey} -UseBasicParsing -ErrorAction Stop
        Write-Host "  Compile $i : HTTP $($resp.StatusCode)"
    } catch {
        Write-Host "  Compile $i : ERROR $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}
Write-Host "  Compile requests done." -ForegroundColor Green

Write-Host "[2/4] Recording visits..." -ForegroundColor Yellow
for ($i = 1; $i -le 15; $i++) {
    try {
        $resp = Invoke-WebRequest -Uri "$baseUrl/api/stats/visit" -Method Post -UseBasicParsing -ErrorAction Stop
        Write-Host "  Visit $i : HTTP $($resp.StatusCode)"
    } catch {
        Write-Host "  Visit $i : ERROR $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 300
}
Write-Host "  Visits done." -ForegroundColor Green

Write-Host "[3/4] Recording downloads..." -ForegroundColor Yellow
for ($i = 1; $i -le 10; $i++) {
    try {
        $resp = Invoke-WebRequest -Uri "$baseUrl/api/stats/download" -Method Post -UseBasicParsing -ErrorAction Stop
        Write-Host "  Download $i : HTTP $($resp.StatusCode)"
    } catch {
        Write-Host "  Download $i : ERROR $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 300
}
Write-Host "  Downloads done." -ForegroundColor Green

Write-Host "[4/4] Checking metrics..." -ForegroundColor Yellow
try {
    $cred = New-Object System.Management.Automation.PSCredential("prom",(ConvertTo-SecureString "prom" -AsPlainText -Force))
    $metrics = Invoke-WebRequest -Uri "$baseUrl/metrics" -UseBasicParsing -Credential $cred -ErrorAction Stop
    $lineCount = ($metrics.Content -split "`n").Count
    Write-Host "  Metrics endpoint responded with $lineCount lines." -ForegroundColor Green
} catch {
    Write-Host "  Metrics check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Load test complete ===" -ForegroundColor Cyan
Write-Host "Prometheus: http://localhost:9090"
Write-Host "Grafana:    http://localhost:3001"
Write-Host "pprof:      http://localhost:6060/debug/pprof/"