# syntax=docker/dockerfile:1

# ---- Stage 1: Build the static assets ----
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .

# Vite inlines VITE_* vars at build time, so they must be present here.
# Override at build with: --build-arg VITE_API_URL=... --build-arg VITE_ENABLE_MOCKS=false
ARG VITE_API_URL=/api
ARG VITE_ENABLE_MOCKS=false
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENABLE_MOCKS=$VITE_ENABLE_MOCKS

RUN npm run build

# ---- Stage 2: Serve with nginx ----
FROM nginx:1.27-alpine AS runtime

# SPA-aware nginx config (deep links fall back to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
