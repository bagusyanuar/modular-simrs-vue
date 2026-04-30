# SSO Implementation Guide for Frontend

Dokumentasi ini menjelaskan alur integrasi Single Sign-On (SSO) menggunakan protokol OAuth2 dengan PKCE (Proof Key for Code Exchange).

## 1. Alur Login Manual (Authorization Code Flow)

Digunakan saat user mengisi form login di aplikasi.

### Step 1: Request Authorization Code

**Endpoint:** `POST /sso/authorize`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "client_id": "simrs-vue-app",
  "code_challenge": "BASE64URL_ENCODED_SHA256_HASH", // Hasil hash SHA256 dari code_verifier
  "redirect_uri": "http://localhost:3000/callback"
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "authorize success",
  "data": {
    "code": "8c66c304-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "state": "RANDOM_STATE_STRING" // [NEW] State yang dikirim FE dikembalikan lagi
  }
}
```

#### Detail Parameter:

| Parameter | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `email` | String | Email user untuk autentikasi. |
| `password` | String | Password user. |
| `client_id` | String | Identifier unik aplikasi (misal: `master-data-app`). |
| `redirect_uri` | String | URL tujuan setelah login sukses (harus terdaftar di whitelist BE). |
| `code_challenge` | String | Hasil `SHA256` dari `code_verifier` yang di-Base64URL encode. |
| `state` | String | String random dari FE untuk mencegah CSRF. BE harus mengembalikan nilai yang sama. |
| `response_type` | String | Selalu `code` untuk Authorization Code flow. |

> **Note:** Request ini akan menanamkan HTTPOnly cookie `sso_session` yang digunakan untuk fitur Silent Login.

---

### Step 2: Exchange Code for Token

**Endpoint:** `POST /sso/token`

**Request Body:**

```json
{
  "grant_type": "authorization_code",
  "client_id": "simrs-vue-app",
  "code": "8c66c304-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // Code dari Step 1
  "code_verifier": "plain-random-string", // String asli sebelum di-hash
  "redirect_uri": "http://localhost:3000/callback"
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "token success",
  "data": {
    "access_token": "eyJhbGciOi...",
    "expires_in": 3600
  }
}
```

> **Note:** Request ini akan menanamkan HTTPOnly cookie `refresh_token`. Field `refresh_token` sengaja dikosongkan di body untuk alasan keamanan.

---

## 2. Silent Login (Cek Sesi SSO)

Digunakan untuk login otomatis tanpa form jika user sudah login di aplikasi lain dalam ekosistem SSO yang sama.

**Endpoint:** `GET /sso/authorize`

**Query Parameters:**

- `client_id`: Identifier unik aplikasi.
- `code_challenge`: Hasil hash verifier (PKCE).
- `state`: String random untuk validasi keamanan di FE.
- `redirect_uri`: URL redirect callback.
- `response_type`: Selalu `code`.

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "code": "8c66c304-xxxx",
    "state": "RANDOM_STATE_STRING"
  }
}
```

**Behavior:**

- **Success (200 OK):** Jika cookie `sso_session` masih valid, akan mengembalikan `code` dan `state`. Lanjutkan ke **Step 2** (Exchange Token).
- **Failure (401 Unauthorized):** Jika sesi tidak ada atau expired. Arahkan user ke halaman login.

---

## 3. Refresh Token

Digunakan saat `access_token` expired.

**Endpoint:** `POST /sso/token`

**Request Body:**

```json
{
  "grant_type": "refresh_token",
  "client_id": "simrs-vue-app"
}
```

**Note:** Backend secara otomatis mengambil value refresh token dari HTTPOnly cookie `refresh_token`. FE cukup mengirimkan `grant_type` dan `client_id`.

---

## Ringkasan Cookie (HTTPOnly)

| Nama Cookie     | Kegunaan                                      | Lifetime      |
| :-------------- | :-------------------------------------------- | :------------ |
| `sso_session`   | Menjaga sesi login global SSO (Silent Login)  | 24 Jam        |
| `refresh_token` | Digunakan untuk mendapatkan access token baru | Sesuai Config |

## Panduan Integrasi SSO SDK

Gunakan `@genossys-hospital/sso-sdk` untuk mempermudah integrasi. SDK ini mengotomatisasi flow PKCE, Token Refresh, dan Session Management.

### 1. Inisialisasi

Buat instance `SSOClient` di level global (misal `src/lib/auth.ts`):

```typescript
import { SSOClient } from '@genossys-hospital/sso-sdk';

export const auth = new SSOClient({
  baseUrl: import.meta.env.VITE_SSO_BASE_URL,
  clientId: import.meta.env.VITE_SSO_CLIENT_ID,
  redirectUri: import.meta.env.VITE_SSO_REDIRECT_URI,
  persistence: 'localstorage', // Opsi: 'memory' | 'localstorage' | 'cookie'
});
```

### 2. Integrasi Vue Router (Guard)

Gunakan helper `createSSOGuard` untuk melindungi route aplikasi. Guard ini mengotomatisasi pengecekan sesi lokal, silent login ke portal, dan penanganan callback PKCE.

```typescript
import { createSSOGuard } from '@genossys-hospital/sso-sdk';
import { router } from './router';
import { auth } from './lib/auth';
import { useUserStore } from './stores/user';

createSSOGuard(router, {
  auth,
  callbackPath: '/callback', // Default: /callback
  publicRoutes: ['/public-page'], // Route yang tidak butuh login
  
  // 🔥 [NEW] Integrasi State Management (Pinia)
  onAuthenticated: async (session) => {
    const userStore = useUserStore();
    userStore.setToken(session.accessToken);
    await userStore.fetchProfile(); // Tarik profile sebelum page muncul
  },

  // 🔥 [NEW] Custom Error Handling
  onAuthError: (error) => {
    console.error('SSO Error:', error.message);
    // Tampilkan toast atau redirect ke error page
  },

  // 🔥 [NEW] Control Redirect
  autoRedirect: true, // Set false jika ingin handle redirect manual
});
```

### 3. Login Manual (AJAX)

Jika aplikasi menyediakan form login sendiri (tanpa redirect ke portal):

```typescript
const handleLogin = async (email, password) => {
  try {
    // 1. Authorize manual via AJAX
    const { code, state } = await auth.authorizeManual({ email, password });
    
    // 2. Exchange code ke token
    await auth.handleCallback(code, state);
    
    // 3. Redirect ke dashboard
    router.push('/');
  } catch (err) {
    alert('Login Gagal');
  }
}
```

### 4. Menggunakan API Client

Gunakan axios instance dari SDK agar token otomatis terlampir dan auto-refresh. **Note:** SDK ini sekarang menggunakan `@genossys-hospital/http-sdk` secara internal, sehingga semua error yang dilempar adalah `HttpError`.

```typescript
import { HttpError } from '@genossys-hospital/http-sdk';

const api = auth.getHttpClient();

try {
  // Token otomatis masuk di header Authorization: Bearer ...
  // Jika 401, SDK otomatis refresh token dan retry request ini.
  const response = await api.get('/api/v1/data-pasien');
} catch (err) {
  if (err instanceof HttpError) {
     console.error('API Error:', err.message);
  }
}
```

---

**Status SDK**: Stable (v1.0.0)
**Fitur**: PKCE Automations, Refresh Queueing, Pluggable Storage, Integrated HTTP Client.
