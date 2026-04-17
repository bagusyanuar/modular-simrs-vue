# Stage 1: Base
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
RUN npm install -g turbo

# Stage 2: Prune
FROM base AS pruner
ARG PKG_NAME
WORKDIR /app
COPY . .
RUN turbo prune --scope=$PKG_NAME --docker

# Stage 3: Builder
FROM base AS builder
ARG APP_NAME
ARG PKG_NAME
WORKDIR /app

# Copy JSON & lockfile
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copy Full source
COPY --from=pruner /app/out/full/ .

# Build
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN turbo build --filter=$PKG_NAME

# Stage 4: Runner (Tanpa Vite Preview, pake sirv-cli lebih lincah & prod-ready)
FROM node:20-alpine AS runner
ARG APP_NAME
ARG PKG_NAME

# Kita butuh sirv-cli buat serve static files secara production-ready
RUN npm install -g sirv-cli

WORKDIR /app

# Kita cuma butuh folder dist dari app yang di-build
COPY --from=builder /app/apps/${APP_NAME}/dist ./dist

# Port default
EXPOSE 8080

# Jalankan sirv untuk serve folder dist
# --single: buat support SPA routing (biar gak 404 pas refresh)
# --host: biar bisa diakses dari luar container
CMD ["sh", "-c", "sirv dist --port 8080 --host --single"]
