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

# Stage 4: Runner (Pake Nginx alpine biar tangguh & ringan)
FROM nginx:alpine AS runner
ARG APP_NAME

WORKDIR /usr/share/nginx/html

# Bersihin default nginx html
RUN rm -rf ./*

# Ambil hasil build dari builder
COPY --from=builder /app/apps/${APP_NAME}/dist .

# Copy konfigurasi custom Nginx untuk SPA
COPY scripts/nginx.conf /etc/nginx/conf.d/default.conf

# Copy script entrypoint
COPY scripts/docker-entrypoint.sh /docker-entrypoint.d/99-env-inject.sh
RUN chmod +x /docker-entrypoint.d/99-env-inject.sh

# Ganti port nginx default menjadi 8080 (karena di nginx.conf kita set 8080)
EXPOSE 8080

# Nginx alpine udah punya ENTRYPOINT sendiri yang ngejalanin file di /docker-entrypoint.d/
# Jadi kita cukup set CMD standar nginx
CMD ["nginx", "-g", "daemon off;"]
