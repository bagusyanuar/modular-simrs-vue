# Scenario Summary: Modular SSO PKCE Authentication

Dokumen ini merangkum arsitektur dan alur kerja sistem Single Sign-On (SSO) menggunakan method PKCE (Proof Key for Code Exchange) yang telah diimplementasikan dalam ekosistem Modular SIMRS.

## 🏗️ Architecture Stack
- **Monorepo**: Terdiri dari App `auth`, `simrs`, dan `finance`.
- **Shared Package**: `@genrs/auth` sebagai *Single Source of Truth* untuk logika keamanan.
- **Domain Strategy**: Menggunakan lokahost DNS (`.neurovi-simulation.test`) untuk berbagi cookie antar subdomain.
- **Tech**: Vue 3.5, TypeScript, Tailwind v4, Native Web Crypto API.

## 🔄 The SSO Flow (Step-by-Step)

### 1. The Entrance (App SIMRS)
- User mengakses `simrs.neurovi-simulation.test:3001`.
- **Centralized Guard** (`createSSOGuard`) mendeteksi tidak ada `access_token`.
- Guard men-generate `code_verifier` dan `code_challenge`.
- User diarahkan ke **Auth Portal**:
  `http://auth.neurovi-simulation.test:3000/authorize?client_id=simrs-app&redirect_uri=.../callback&code_challenge=...`

### 2. The Command Center (App Auth)
- **Auto-Check**: Jika user sudah pernah login sebelumnya (punya cookie domain), App Auth akan otomatis melakukan redirect balik tanpa menampilkan form login (**Seamless SSO**).
- **Login Flow**: Jika belum login, user memasukkan kredensial (`admin@genrs.com` / `admin123`).
- **Success Handshake**: App Auth mengirim user kembali ke SIMRS dengan membawa `auth_code` dan `state`.

### 3. The Callback (App SIMRS)
- Guard di SIMRS menangkap `auth_code`.
- Melakukan "Jabat Tangan" (Token Exchange) menggunakan `code_verifier` yang tersimpan di `sessionStorage`.
- Token disimpan ke **Shared Cookie** (`.neurovi-simulation.test`).
- User resmi masuk ke Dashboard SIMRS.

## 🛠️ Key Components Implementasi

| Component | Path | Function |
| :--- | :--- | :--- |
| **PKCE Logic** | `packages/auth/src/pkce.ts` | Hashing SHA-256 native & Base64URL encoding. |
| **Storage** | `packages/auth/src/storage.ts` | Cookie manager dengan dukungan Wildcard Domain. |
| **Shared Guard** | `packages/auth/src/guard.ts` | Vue Router Guard yang bisa dipakai semua Shell App. |
| **Auth Logic** | `features/.../useAuthFlow.ts` | Orchestrator di sisi Auth Portal (The Redirector). |

## ⚠️ Important Notes for Development

> [!IMPORTANT]
> **Chrome Flags**: Karena menggunakan `crypto.subtle` di domain non-localhost/non-https, wajib mengaktifkan flag:
> `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
> Sertakan: `http://simrs.neurovi-simulation.test:3001,http://auth.neurovi-simulation.test:3000,http://finance.neurovi-simulation.test:3002`

> [!TIP]
> **Token Exchange Mock**: Untuk saat ini, proses tukar `code` jadi `token` di SIMRS dan Auth Portal masih menggunakan **Mock Logic**. Jika Backend sudah siap, tinggal ganti pemanggilan fungsi `handleTokenExchange` di `guard.ts` dan `useAuthFlow.ts` menggunakan API asli.

---
**Status**: Ready for Integration Test.
**Next Step**: Implementasi Guard di App Finance & Integrasi Real API Backend.
