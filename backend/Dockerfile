FROM golang:1.25-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

FROM alpine:3.21
RUN apk add --no-cache curl fontconfig && \
    curl -sL https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.16.9/tectonic-0.16.9-x86_64-unknown-linux-musl.tar.gz | tar xz -C /usr/local/bin tectonic && \
    apk del curl
WORKDIR /app
COPY --from=builder /app/server .
RUN mkdir -p /app/temp
EXPOSE 8080
CMD ["./server"]
