# Dynamic Gateway Strategy (Dev Proxy)

## 1. Overview

Strategi ini bertujuan untuk memisahkan tanggung jawab **Routing/Gateway** dari aplikasi UI (`old-app`, `simrs`, dsb) ke sebuah service mandiri bernama **Dedicated Dev Proxy**. Hal ini memungkinkan pengembang untuk mengganti aplikasi utama (Root `/`) secara dinamis tanpa mengubah kode di aplikasi lain.

## 2. Arsitektur

### 2.1 Dedicated Dev Proxy
Sebuah package minimalis (misal: `@genrs/dev-proxy`) yang berjalan di port utama (default: `3000`). Tugasnya hanya satu: meneruskan request (proxy) ke port internal aplikasi masing-masing berdasarkan konfigurasi `.env`.

### 2.2 App Isolation
Aplikasi UI tidak lagi memiliki konfigurasi `server.proxy` untuk module lain. Setiap aplikasi hanya fokus pada port internalnya sendiri. Keuntungannya:
- Aplikasi dapat dijalankan secara independen tanpa ketergantungan urutan port.
- Mempermudah transisi dari V1 ke V2 karena "Boss" (Root) bisa dipindah dengan sekali klik.

## 3. Konfigurasi Environment (`.env`)

Diusulkan struktur variabel yang memisahkan **Internal Port** dan **Gateway Routing**:

```bash
# Gateway setting
DEV_GATEWAY_PORT=3000

# Apps actual ports (Internal/Service Ports)
PORT_OLD_APP=4001
PORT_SSO=4002
PORT_SIMRS=4003
PORT_MASTER_DATA=4004

# Routing Logic (Siapa yang memegang root '/')
VITE_ROOT_APP_PORT=${PORT_OLD_APP}

# Path Mapping (Mapping sub-path ke port internal)
VITE_PATH_SSO="/sso"
VITE_PATH_V2="/v2"
VITE_PATH_MASTER="/md"
```

## 4. Mekanisme Kerja

1.  **Runner**: Turbo menjalankan semua filter aplikasi terpilih + `dev-proxy`.
2.  **Proxy Server**:
    - Mendengarkan di port `3000`.
    - Jika request ke `/sso`, arahkan ke `localhost:PORT_SSO`.
    - Jika request ke `/v2`, arahkan ke `localhost:PORT_SIMRS`.
    - Jika request ke `/` (Root), arahkan ke `localhost:VITE_ROOT_APP_PORT`.
3.  **GateKeeper**: Tetap melakukan pengecekan jika developer mencoba mengakses port internal (misal `4002`), maka akan diredirect kembali ke port Gateway (`3000`).

## 5. Keuntungan
- **Flexibility**: Bisa ganti Entry Point dari `old-app` ke `master-data` hanya dengan mengubah `VITE_ROOT_APP_PORT`.
- **Stability**: Jika salah satu app mati, proxy tetap jalan dan bisa memberikan feedback yang lebih jelas di browser.
- **Clean Code**: Pembersihan `vite.config.ts` di semua aplikasi dari konfigurasi proxy yang berulang.
