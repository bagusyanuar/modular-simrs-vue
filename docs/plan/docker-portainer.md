# 🐳 Docker & Portainer Deployment Strategy

Dokumen ini menjelaskan arsitektur deployment aplikasi Frontend di monorepo GenRS menggunakan Docker dan Portainer dengan pendekatan **Runtime Environment Variables**.

## 🚀 Filosofi: Build Once, Run Anywhere
Kita menggunakan strategi di mana image Docker hanya di-build **satu kali**, tetapi bisa dideploy ke berbagai environment (Dev, Staging, Prod) tanpa perlu build ulang. Perubahan konfigurasi (seperti URL API) dilakukan cukup melalui Environment Variables di Portainer.

## 🏗️ Arsitektur Dockerfile
- **Base Stage**: Node 20 & Pnpm 10.
- **Builder Stage**: Menggunakan Turbo untuk pruning dan building workspace secara efisien.
- **Runner Stage**: Menggunakan **Nginx Alpine** untuk performa maksimal dan keamanan.

## 🛠️ Mekanisme Runtime Env
Karena aplikasi Vue adalah statis (di-compile jadi JS), kita tidak bisa membaca `process.env` secara langsung di browser. Kita menggunakan trik **Dynamic Config Injection**:

1.  **`index.html`**: Memuat script `<script src="/config.js"></script>`.
2.  **`docker-entrypoint.sh`**: Script ini berjalan otomatis saat container start (sebelum Nginx nyala).
    - Script akan memindai semua Environment Variable yang diawali dengan `VITE_`.
    - Script membuat file `/usr/share/nginx/html/config.js` secara dinamis.
3.  **`@genrs/utils/env.ts`**: Aplikasi membaca konfigurasi melalui utility `getEnv()` yang memprioritaskan `window.config` (Runtime) daripada `import.meta.env` (Build-time).

## 📋 Panduan untuk Tim Infra (Portainer)

### 1. Konfigurasi Environment Variables
Di Portainer, Tim Infra cukup menambahkan variable sesuai kebutuhan aplikasi. Contoh:
- `VITE_SSO_BASE_URL`: `http://sso-api.neurovi.test:8081/api/v1/sso`
- `VITE_SSO_DOMAIN`: `.neurovi.test`
- `VITE_API_URL`: `http://api.neurovi.test`

### 2. Port & Routing
- **Internal Port**: Image mengekspos port `8080`.
- **SPA Routing**: Nginx sudah dikonfigurasi untuk menangani *Client-side Routing* (HTML5 History Mode). Jika user melakukan refresh pada URL seperti `/dashboard`, Nginx akan otomatis mengarahkan ke `index.html`.

## 📂 File Terkait
- `Dockerfile`: Definisi build monorepo.
- `scripts/docker-entrypoint.sh`: Script generator `config.js`.
- `scripts/nginx.conf`: Konfigurasi server Nginx.
- `packages/utils/src/env.ts`: SDK untuk akses environment.

---
**Status**: ✅ Production Ready
