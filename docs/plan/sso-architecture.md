# SSO Architecture Plan - Modular SIMRS

Dokumen ini merangkum hasil brainstorming arsitektur SSO untuk sistem Modular SIMRS.

## 1. Konsep Dasar
SSO (Single Sign-On) akan berjalan di domain `sso.neurovi.com` dan bertindak sebagai **Identity Provider (IdP)** pusat untuk seluruh sub-aplikasi (Inventory, Finance, dll).

## 2. Struktur Portal SSO (`apps/neurovi-sso`)
Portal ini memiliki peran ganda:
- **Login Portal:** Halaman login utama untuk user.
- **Admin Dashboard:** Halaman manajemen untuk mendaftarkan `client_id`, mengatur `redirect_uri`, dan manajemen session.

### Intelligent Routing (Root `/`)
Aplikasi Portal harus cerdas dalam menentukan arah redirect setelah login:
- **Kondisi A (OAuth Context):** Jika terdapat query params `client_id` & `redirect_uri`, selesaikan flow OIDC/OAuth2 dan redirect balik ke aplikasi pengirim.
- **Kondisi B (Direct/Admin Context):** Jika tidak ada params OAuth, redirect user (jika memiliki role Admin) ke `/dashboard` internal portal.

## 3. Peran SDK SSO (`packages/sdk-sso`)
SDK ini bersifat **Headless** dan **Client-only**:
- Hanya menangani protokol standar (PKCE, Token Exchange, Silent Login, Refresh Token).
- Tidak boleh mengandung logika internal Portal (seperti manajemen client).
- Digunakan oleh seluruh sub-aplikasi SIMRS untuk terhubung ke Portal.

## 4. Kebutuhan Backend SSO
Backend harus mendukung dua jenis endpoint:

### A. Public OIDC Endpoints (Standard)
- `/authorize`: Penanganan redirect & grant code.
- `/token`: Pertukaran code menjadi JWT (Access/Refresh Token).
- `/userinfo`: Endpoint profil user.
- `/logout`: Pembersihan session global.

### B. Internal API Endpoints
- `/api/v1/login`: Autentikasi kredensial (Username/Password).
- `/api/v1/clients`: CRUD Client Management (Client ID, Secret, Redirect URIs).
- `/api/v1/roles`: Manajemen hak akses user.

## 5. Flow Autentikasi
1. **User Discovery:** User akses `inventory.com`.
2. **SDK Guard:** `@genossys-hospital/sdk-sso` mendeteksi tidak ada session -> Redirect ke `sso.neurovi.com`.
3. **SSO Login:** Portal menampilkan UI login yang seragam.
4. **Smart Redirect:** Backend SSO memvalidasi kredensial:
   - Jika berasal dari `inventory.com`, lempar balik bawa `code`.
   - Jika akses langsung, buka Dashboard Admin SSO.
5. **Session Persistence:** Menggunakan cookie di domain `neurovi.com` untuk *Silent Login* lintas sub-domain.

---
**Note:** Pastikan tim Backend memahami pemisahan antara Session Cookie (SSO Portal) dan JWT/Bearer Token (Client Apps).
