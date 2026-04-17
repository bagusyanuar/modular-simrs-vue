# Stage 1: Base image
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN npm install -g turbo

# Stage 2: Prune workspace
FROM base AS pruner
ARG PKG_NAME
WORKDIR /app
COPY . .
# Menghasilkan subset workspace yang hanya dibutuhkan oleh target app
RUN turbo prune --scope=$PKG_NAME --docker

# Stage 3: Install dependencies
FROM base AS installer
ARG PKG_NAME
WORKDIR /app
# Ambil file config pnpm/package yang sudah di-prune
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Stage 4: Build app
FROM base AS builder
ARG APP_NAME
ARG PKG_NAME
WORKDIR /app
COPY --from=pruner /app/out/full/ .
COPY --from=installer /app/node_modules ./node_modules
# Inject ENV production jika diperlukan (opsional)
ENV NODE_ENV=production
RUN turbo build --filter=$PKG_NAME

# Stage 5: Runner (Node only)
FROM base AS runner
ARG APP_NAME
ARG PKG_NAME
WORKDIR /app

# Copy everything from builder (including node_modules and built dist)
COPY --from=builder /app .

# Port default Vite preview (4173) atau sesuaikan dengan config
EXPOSE 4173

# Jalankan preview atau command lain secara JSON format
# Pakai shell helper supaya bisa baca filter dari arg
ENTRYPOINT ["pnpm", "turbo", "run", "preview"]
CMD ["--filter=$PKG_NAME"]
