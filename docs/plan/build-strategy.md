# Build & Deployment Strategy (Production)

## 1. Server Specification

Rekomendasi spesifikasi server untuk menjalankan ekosistem Modular SIMRS:

| Environment | CPU | RAM | Storage | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Development** (Local/Team) | 4-8 Cores | 16-32 GB | SSD NVMe | Untuk kelancaran Turbo, HMR, dan IDE. |
| **Production** (VPS) | 1-2 Cores | 2-4 GB | SSD 20-40 GB | Hanya menjalankan Nginx (Very Lightweight). |

> [!TIP]
> Di server produksi (VPS), disarankan memasang **SWAP 4GB** untuk menjaga stabilitas saat proses pemeliharaan atau lonjakan traffic.

## 2. Docker Strategy: Multi-stage Build

Untuk efisiensi dan keamanan, setiap aplikasi menggunakan strategi **Multi-stage Build**.

- **Stage 1 (Build)**: Menggunakan `node:alpine`. Melakukan instalasi dependencies dan proses build monorepo via Turbo.
- **Stage 2 (Runtime)**: Menggunakan `nginx:alpine`. Hanya menyalin file `dist` dari Stage 1. 
- **Hasil**: Image aplikasi yang sangat kecil (~20-50 MB) dan aman (tanpa source code/Node.js di dalam container).

> [!IMPORTANT]
> **Catatan untuk Tim Infra:**
> Karena arsitektur Frontend menggunakan mekanisme *Baked-in Environment*, Tim Infra **WAJIB** memasukkan/menempelkan file `.env` global (berisi variabel production seperti SSO Domain & API URL) ke dalam root direktori sebelum menjalankan perintah `docker build`. Variabel di level tenant akan otomatis diambil dari file `.env.[tenant]` yang ada di folder aplikasi masing-masing.

## 3. GHCR.io Integration

Semua docker images disimpan di **GitHub Container Registry (GHCR)**. 
- **Registry URL**: `ghcr.io/bagusyanuar/modular-simrs-vue/`
- **Naming Convention**: `[app-name]:latest` atau `[app-name]:v[version]`.

## 4. Git Tag-based Build Strategy

Proses build otomatis dipicu oleh **Git Tag** dengan konvensi penamaan tertentu untuk menentukan Aplikasi, Environment, dan Tenant.

| Tag Pattern | Target App | Environment | Tenant | Vite Mode |
| :--- | :--- | :--- | :--- | :--- |
| `[app]-v*` | `[app]` | Production | base | `production` |
| `[app]-dev-v*` | `[app]` | Development | base | `development` |
| `[app]-staging-v*` | `[app]` | Staging | base | `staging` |
| `[app]-[tenant]-v*` | `[app]` | Production | `[tenant]` | `[tenant]` |
| `[app]-dev-[tenant]-v*` | `[app]` | Development | `[tenant]` | `development-[tenant]` |
| `[app]-staging-[tenant]-v*` | `[app]` | Staging | `[tenant]` | `staging-[tenant]` |

### 4.1 Mekanisme Build Mode
Workflow akan mengekstrak informasi dari tag dan meneruskannya sebagai `BUILD_MODE` ke Docker. Vite kemudian akan memuat file `.env` yang sesuai:
- `MODE=rspku` -> Memuat `.env.rspku`
- `MODE=staging-rspku` -> Memuat `.env.staging-rspku`

Ini memungkinkan kustomisasi `VITE_TENANT` dan API URL pada level tenant per environment.

### 4.2 Cara Build (Push Tag)

Gunakan perintah git tag berikut untuk memicu build otomatis via GitHub Actions:

```bash
# 1. Build Production (Base)
git tag simrs-v1.0.0
git push origin simrs-v1.0.0

# 2. Build Staging (Base)
git tag simrs-staging-v1.0.0
git push origin simrs-staging-v1.0.0

# 3. Build Production Tenant (RSPKU)
git tag simrs-rspku-v1.0.0
git push origin simrs-rspku-v1.0.0

# 4. Build Staging Tenant (RSPKU)
git tag simrs-staging-rspku-v1.0.0
git push origin simrs-staging-rspku-v1.0.0

# 5. Build Development (Base)
git tag simrs-dev-v1.0.0
git push origin simrs-dev-v1.0.0

# 6. Build Development Tenant (RSPKU)
git tag simrs-dev-rspku-v1.0.0
git push origin simrs-dev-rspku-v1.0.0
```

> [!IMPORTANT]
> Pastikan nama aplikasi (`simrs`, `auth`, `old-app`) sesuai dengan nama folder di direktori `apps/`.

## 5. Deployment Architecture

Menggunakan pola **Reverse Proxy Gateway**. Satu pintu masuk utama (`gateway-nginx`) yang mendistribusikan traffic ke container masing-masing di dalam network Docker internal.

### 5.1 `docker-compose.yml` (Contoh)

```yaml
version: '3.8'

services:
  gateway:
    image: nginx:stable-alpine
    ports: ["80:80", "443:443"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf:ro"]
    networks: ["simrs-net"]

  sso:
    image: ghcr.io/bagusyanuar/modular-simrs-vue/sso:latest
    networks: ["simrs-net"]

  v1-app:
    image: ghcr.io/bagusyanuar/modular-simrs-vue/v1-app:latest
    networks: ["simrs-net"]

  master-data:
    image: ghcr.io/bagusyanuar/modular-simrs-vue/master-data:latest
    networks: ["simrs-net"]

networks:
  simrs-net:
    driver: bridge
```

### 5.2 `nginx.conf` Gateway (Routing Logic)

```nginx
server {
    listen 80;
    server_name neurovi.id;

    location /sso/ {
        proxy_pass http://sso/;
    }

    location /v2/master-data/ {
        proxy_pass http://master-data/;
    }

    location / {
        proxy_pass http://v1-app/;
    }
}
```

## 6. Keuntungan Arsitektur
1. **Independent Deployment**: Update module tertentu tanpa mengganggu module lain.
2. **Resource Efficiency**: Hemat RAM Cold-Storage karena image sangat kecil.
3. **Security**: Port internal aplikasi tidak terekspos ke dunia luar.
