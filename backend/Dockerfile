FROM golang:1.23-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

FROM alpine:3.19
RUN apk add --no-cache tectonic curl
WORKDIR /app
COPY --from=builder /app/server .
RUN mkdir -p /app/temp
EXPOSE 8080
CMD ["./server"]
