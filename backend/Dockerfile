FROM golang:1.25-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server ./cmd/server

FROM alpine:3.21
RUN apk add --no-cache ca-certificates curl fontconfig && \
    curl -sL https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.16.9/tectonic-0.16.9-x86_64-unknown-linux-musl.tar.gz | tar xz -C /usr/local/bin tectonic && \
    apk del curl

WORKDIR /app
COPY --from=builder /app/server .

ENV XDG_CACHE_HOME=/home/appuser/.cache
RUN mkdir -p /app/temp /data /home/appuser/.cache/Tectonic && \
    adduser -D -u 1001 appuser && \
    chown -R appuser:appuser /app /data /home/appuser

USER appuser
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/api/health || exit 1

CMD ["./server"]
