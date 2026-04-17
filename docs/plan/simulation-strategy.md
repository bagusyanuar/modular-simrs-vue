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

