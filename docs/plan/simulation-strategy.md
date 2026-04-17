# SIMRS V1 to V2 Migration & SSO Strategy

## 1. Overview

Strategi migrasi **Strangler Fig Pattern** untuk transisi dari `old-app` (V1) ke `simrs` (V2) dengan sistem **Single Sign-On (SSO)** tersentralisasi di `auth` app. Karena ini merupakan aplikasi internal, prioritas utama adalah fungsionalitas dan keamanan sesi, bukan SEO.

## 2. Infrastructure & Routing (Path Mapping)

Seluruh aplikasi akan berjalan di bawah root domain yang sama untuk memudahkan sharing context.

- **Domain Utama**: `neurovi-simulation.test`
- **Path Mapping**:
  - `/sso`: Diarahkan ke `apps/auth`. Mengelola login, logout, dan manajemen sesi.
  - `/` (Root): Diarahkan ke `apps/old-app`. Sebagai "tuan rumah" (Legacy V1) sekaligus entry point utama saat ini.
  - `/v2`: Diarahkan ke `apps/simrs`. Sebagai platform masa depan (Modern V2).

## 3. Authentication & Session Management

Menggunakan skema **Shared Cookie** untuk transmisi token antar sub-path.

### Mekanisme Sharing

- **Cookie Scope**: Di-set pada level domain `.neurovi-simulation.test` agar bisa diakses oleh `/`, `/sso`, dan `/v2`.
- **Primary Tokens**:
  - `access_token`: Token berumur pendek untuk otorisasi API.
  - `refresh_token`: Token berumur panjang untuk pembaruan sesi.
- **Security**: Cookie di-set dengan `SameSite: Lax` dan `Path: /`. Karena token perlu dibaca oleh Javascript (Axios), `httpOnly` diset ke `false`.

### Mekanisme Pengiriman (Bearer Token)

Meskipun token disimpan di Cookie, komunikasi ke Backend tetap menggunakan standar **Bearer Authentication**:

1. Axios Interceptor (di `@genrs/http`) membaca token dari Cookie via `SessionManager`.
2. Token ditempelkan pada header `Authorization: Bearer <token>`.
3. Jika mendapat response `401`, interceptor melakukan refresh token otomatis menggunakan `refresh_token` dari Cookie.

## 4. Strangler Fig Implementation

1. **Reverse Proxy Dev**: `old-app` akan mengkonfigurasi Vite Proxy untuk melempar traffic `/sso` dan `/v2` ke port masing-masing app.
2. **SSO Redirect**: Jika user mengakses V1 atau V2 tanpa sesi valid, app akan me-redirect user ke `/sso/login?return_url=<current_url>`.
3. **Seamless UI**: Sidebar dan Header di V1 dan V2 diusahakan identik secara visual menggunakan shared component dari `packages/ui`.

## 6. Local Development Setup

Untuk menjalankan ekosistem simulasi ini secara lokal, diperlukan konfigurasi host dan environment agar routing sub-domain/sub-path berjalan lancar.

### 6.1 Hosts Configuration

Tambahkan baris berikut di file `hosts` sistem (Windows: `C:\Windows\System32\drivers\etc\hosts`, Linux/macOS: `/etc/hosts`):

```bash
# Modular SIMRS Simulation Domains
127.0.0.1  neurovi-simulation.test
127.0.0.1  auth.neurovi-simulation.test
127.0.0.1  simrs.neurovi-simulation.test
127.0.0.1  old-app.neurovi-simulation.test
127.0.0.1  api.neurovi-simulation.test
```

### 6.2 Environment Variables

Pastikan file `.env` di root direktori sudah dikonfigurasi. Referensi dapat dilihat pada `.env.example`.

### 6.3 Running the Simulation

Gunakan script pnpm yang sudah disediakan di root `package.json` untuk menjalankan semua aplikasi sekaligus:

```bash
pnpm dev:simulation
```

Script ini akan menjalankan `auth-app`, `old-app`, dan `simrs-app` secara bersamaan menggunakan Turborepo.

## 7. Target Akhir

Secara bertahap, module-module di V1 (`old-app`) akan dimatikan dan navigasi akan diarahkan ke V2 (`simrs`), hingga akhirnya `old-app` bisa di-pensiunkan sepenuhnya.

## 8. Containerization (Docker)

Sistem menggunakan **Multi-stage Dockerfile** di root direktori yang mendukung build selektif per-aplikasi menggunakan Turborepo.

### 8.1 Build Strategy & Arguments

Gunakan `--build-arg APP_NAME` untuk menentukan aplikasi mana yang akan dimasukkan ke dalam image.

- **Dockerfile Context**: Harus dijalankan dari root direktori monorepo.
- **Base Image**: `node:20-alpine` (untuk build & runtime).
- **Runtime**: Menjalankan `pnpm preview` melalui port `4173`.

### 8.2 Build & Tagging Commands

Format tag yang direkomendasikan untuk **GHCR**: `ghcr.io/<owner>/<repo>/<app-name>:<tag>`

| Aplikasi | Build Command |
| :--- | :--- |
| **Auth** | `docker build --build-arg APP_NAME=auth -t ghcr.io/bagusyanuar/modular-simrs-vue/auth:latest .` |
| **SIMRS** | `docker build --build-arg APP_NAME=simrs -t ghcr.io/bagusyanuar/modular-simrs-vue/simrs:latest .` |
| **Old App** | `docker build --build-arg APP_NAME=old-app -t ghcr.io/bagusyanuar/modular-simrs-vue/old-app:latest .` |

### 8.3 Registry Login

Sebelum melakukan push ke GHCR, pastikan sudah login menggunakan Personal Access Token (PAT):

```bash
echo $MY_PAT | docker login ghcr.io -u <github-username> --password-stdin
```

### 8.4 CI/CD Tagging Strategy

Build otomatis via **GitHub Actions** dipicu menggunakan Git Tags dengan format `[app-name]-v[version]`.

| Target App | Tag Format | Command Contoh |
| :--- | :--- | :--- |
| **Auth** | `auth-v*` | `git tag auth-v1.0.0 && git push origin auth-v1.0.0` |
| **SIMRS** | `simrs-v*` | `git tag simrs-v1.0.0 && git push origin simrs-v1.0.0` |
| **Old App** | `old-app-v*` | `git tag old-app-v1.0.0 && git push origin old-app-v1.0.0` |

> [!NOTE]
> Workflow ini bersifat selektif. Jika Anda melakukan push tag `auth-v1.0.0`, maka sistem hanya akan melakukan build dan push untuk image **Auth** saja. Push ke branch biasa tidak akan men-trigger build image.
