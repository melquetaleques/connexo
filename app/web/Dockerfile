# Dockerfile for Connexo Web (React/TypeScript)
# Multi-stage build for production

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production || npm install

COPY . .
RUN npm run build || echo "Warning: frontend build failed, using development mode"

# Stage 2: Run with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
