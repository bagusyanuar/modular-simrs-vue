# Stage 1: Base (Pake slim agar build toolchain lebih stabil)
FROM node:20-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
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

# Manually copy root config files that might be missed by turbo prune
COPY tsconfig.base.json .

# BUILD TANPA VUE-TSC (Cek type via Husky/Local saja)
ARG BUILD_MODE=production
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 1. Build semua dependencies internal (packages/*)
# Pake filter "...pkg" (build pkg + deps) digabung "!pkg" (kecuali pkg itu sendiri)
# Ini cara paling aman buat build cuma dependencies-nya aja.
RUN turbo build --filter="...${PKG_NAME}" --filter="!${PKG_NAME}"

# 2. Build aplikasi utama menggunakan vite secara langsung (skip vue-tsc)
# Oper BUILD_MODE ke --mode vite buat penentuan Tenant
RUN pnpm --filter=$PKG_NAME exec vite build --mode $BUILD_MODE

# Stage 4: Runner (Pake alpine biar image akhir super kecil)
FROM node:20-alpine AS runner
ARG APP_NAME

# Install sirv-cli buat serve static files
RUN npm install -g sirv-cli

WORKDIR /app

# Ambil hasil build saja
COPY --from=builder /app/apps/${APP_NAME}/dist ./dist

EXPOSE 8080

# Serve menggunakan sirv agar support SPA routing
CMD ["sh", "-c", "sirv dist --port 8080 --host --single"]
