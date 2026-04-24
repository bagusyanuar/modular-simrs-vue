# Scenario Summary: Modular SSO PKCE Authentication

Dokumen ini merangkum arsitektur dan alur kerja sistem Single Sign-On (SSO) menggunakan method PKCE (Proof Key for Code Exchange) yang telah diimplementasikan dalam ekosistem Modular SIMRS.

## 🏗️ Architecture Stack
- **Monorepo**: Terdiri dari App `auth`, `simrs`, dan `finance`.
- **Shared Package**: `@genrs/auth` sebagai *Single Source of Truth* untuk logika keamanan.
- **Domain Strategy**: Mendukung *Wildcard Subdomain* (via Cookie) dan *Truly Cross-Domain* (via PKCE Token Exchange).
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

## 🌐 Truly Cross-Domain Strategy (Beda Domain Induk)
Jika aplikasi berada di domain berbeda (misal: `simrs-a.com` vs `sso-pusat.id`), sharing cookie tidak dimungkinkan. Kita menggunakan **Token Exchange Flow**:

1. **The Handshake**:
   - App `simrs-a.com` men-generate `code_verifier` dan menyimpannya di `sessionStorage` (lokal domain A).
   - Redirect ke SSO membawa `code_challenge`.
2. **The Callback**:
   - Setelah login, SSO melempar balik ke `simrs-a.com/callback?code=...`.
   - App `simrs-a.com` melakukan `POST` request ke SSO untuk menukar `code` + `verifier` menjadi Token.
3. **Token Management**:
   - **Storage**: Token disimpan di `localStorage` masing-masing domain aplikasi.
   - **Synchronization**: Jika antar tab dalam satu domain ingin sinkron, gunakan `BroadcastChannel` API.
   - **Silent Login**: Untuk integrasi antar domain (misal dari App A pindah ke App B), App B akan melakukan redirect singkat ke SSO. Karena user sudah punya session cookie di domain SSO, SSO akan otomatis melempar balik ke App B dengan `code` baru tanpa interaksi user.

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

## 💻 Implementation Examples

### A. Sisi SIMRS (Client App)
Proses inisiasi login dan handle callback.

```typescript
// 1. Inisiasi Login (Auth Guard / Login Button)
const login = async () => {
  const { verifier, challenge } = await pkce.generate();
  sessionStorage.setItem('sso_verifier', verifier); // Simpan rahasia
  
  window.location.href = `https://sso.id/auth?challenge=${challenge}&id=simrs`;
};

// 2. Handle Callback (di route /callback)
const handleCallback = async (code: string) => {
  const verifier = sessionStorage.getItem('sso_verifier');
  const token = await api.post('/token', { code, verifier }); // Tukar!
  localStorage.setItem('token', token.access_token);
};
```

### B. Sisi SSO Portal (Frontend Portal)
Proses menangkap request dan melempar balik user.

```typescript
// 1. Ambil request dari URL params
const request = {
  challenge: route.query.code_challenge,
  redirectUri: route.query.redirect_uri,
};

// 2. Setelah login sukses, minta 'code' ke backend & redirect balik
const onSuccessLogin = async () => {
  const { code } = await api.post('/auth/code', { challenge: request.challenge });
  window.location.href = `${request.redirectUri}?code=${code}`;
};
```

### C. Sisi SSO Portal (Backend Server)
Proses validasi dan pengiriman token.

```typescript
// 1. Endpoint /token (Backend SSO)
const exchangeToken = async (req) => {
  const { code, verifier } = req.body;
  const storedChallenge = await db.getChallengeByCode(code);
  
  // Validasi: Hash(verifier) == storedChallenge
  if (verifyPKCE(verifier, storedChallenge)) {
    return generateJWT(user); // Kasih token!
  }
};
```

---
**Status**: Ready for Integration Test.
**Next Step**: Implementasi Guard di App Finance & Integrasi Real API Backend.
