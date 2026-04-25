# 🔐 SDK: @genrs/sso

Package ini adalah Client SDK untuk menangani otentikasi Single Sign-On (SSO) dengan protokol PKCE dan Silent Login.

## 🚀 Fitur
- **PKCE Support**: Otomatis generate `code_verifier` dan `code_challenge`.
- **Silent Login**: Cek sesi ke backend tanpa redirect jika user sudah login.
- **SSO Guard**: Navigation guard untuk Vue Router yang menangani redirect login & callback.
- **Independent Session**: Mengelola storage token (Cookie) secara mandiri.

## 📦 Instalasi (Workspace)
Pastikan aplikasi sudah mereferensikan package ini di `package.json`:
```json
"dependencies": {
  "@genrs/sso": "workspace:*"
}
```

## 🛠️ Cara Penggunaan

### 1. Inisialisasi Guard di Router
Pasang `createSSOGuard` pada instance router utama aplikasi (Shell App).

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { createSSOGuard } from '@genrs/sso';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/callback', component: () => import('./Callback.vue') } // Route kosong untuk handle redirect
  ]
});

createSSOGuard(router, {
  baseUrl: import.meta.env.VITE_SSO_BASE_URL,    // Endpoint API SSO (port 8081)
  clientId: 'simrs-app',                         // Client ID terdaftar
  portalUrl: 'http://sso.neurovi.test:3000',     // URL UI Portal SSO
  sessionConfig: {
    domain: '.neurovi.test',                     // Domain untuk shared cookie
    secure: false                                // True jika HTTPS
  },
  onAuthenticated: (session) => {
    // CALLBACK: Update Pinia store di sini
    const authStore = useAuthStore();
    authStore.setTokens(session);
  }
});
```

### 2. Manual Login (Portal SSO UI)
Gunakan `createSSOClient` jika Anda membangun aplikasi Portal SSO itu sendiri.

```typescript
import { createSSOClient } from '@genrs/sso';

const client = createSSOClient({ ...config });

// Hit authorize saat submit form login
const handleLogin = async () => {
  const { code } = await client.authorize({ email, password, state, code_challenge });
  window.location.href = `${redirectUri}?code=${code}&state=${state}`;
};
```

## 🔐 Keamanan
- `code_verifier` disimpan di `sessionStorage` dan hanya dikirim saat `/token` (exchange).
- Parameter `state` wajib ada untuk mencegah serangan CSRF.
