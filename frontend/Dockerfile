FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm matching packageManager version
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

# Skip downloading Chrome for puppeteer during container build
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Set compile key for build-time Vite injection (must be supplied via --build-arg or docker-compose args)
ARG VITE_COMPILE_API_KEY
ENV VITE_COMPILE_API_KEY=$VITE_COMPILE_API_KEY

# Use fast build (without puppeteer crawler) for containerized SPA
RUN pnpm run build:fast

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/cache/nginx/client_temp /run && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /run/nginx.pid && \
    chown -R nginx:nginx /run/nginx.pid

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
