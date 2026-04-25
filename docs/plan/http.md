# 🌐 SDK: @genrs/http

Package ini menyediakan wrapper Axios dan Interceptor otentikasi yang **Agnostic** (tidak terikat pada sistem auth tertentu).

## 🚀 Fitur
- **Zero Dependency Auth**: Tidak terikat pada `@genrs/sso` atau Pinia.
- **Token Injection**: Otomatis menyuntikkan header `Authorization: Bearer <token>`.
- **Refresh Token Queue**: Menangani antrian request saat token sedang diperbarui (mencegah multiple refresh calls).
- **Flexible Callbacks**: Kontrol penuh atas pengambilan token dan logic refresh dari level aplikasi.

## 📦 Instalasi
```json
"dependencies": {
  "@genrs/http": "workspace:*"
}
```

## 🛠️ Cara Penggunaan

### 1. Inisialisasi Axios Instance
Buat instance axios dan pasang interceptor-nya.

```typescript
import axios from 'axios';
import { setupRequestInterceptor, setupResponseInterceptor } from '@genrs/http';
import { useAuthStore } from '@/stores/auth'; // Contoh pake Pinia
import { ssoClient } from '@/api/sso';      // Instance SSO Client

const api = axios.create({
  baseURL: '/api/v1'
});

const authOptions = {
  // Cara ambil token (Reactive)
  getToken: () => useAuthStore().accessToken,

  // Logic refresh token jika dapet 401
  refreshToken: async () => {
    const authStore = useAuthStore();
    const newTokens = await ssoClient.refreshToken({ 
      refresh_token: authStore.refreshToken 
    });
    
    // Simpan hasil refresh ke Store
    authStore.setTokens(newTokens);
    return newTokens.access_token;
  },

  // Jika refresh gagal atau user tidak punya akses
  onUnauthorized: (error) => {
    const authStore = useAuthStore();
    authStore.logout();
    window.location.reload(); // Biar SSO Guard handle redirect
  }
};

setupRequestInterceptor(api, authOptions);
setupResponseInterceptor(api, authOptions);

export default api;
```

## 🔄 Alur Refresh Token
1. Request dikirim -> `setupRequestInterceptor` menyuntikkan token dari `getToken()`.
2. Response 401 (Unauthorized) diterima -> `setupResponseInterceptor` mencegat error.
3. Interceptor masuk ke mode `isRefreshing = true`.
4. Request lain yang masuk saat proses refresh akan dimasukkan ke `failedQueue`.
5. `refreshToken()` dipanggil -> App melakukan hit ke server auth.
6. Refresh sukses -> Token baru disimpan, semua request di `failedQueue` dijalankan ulang dengan token baru.
7. Refresh gagal -> `onUnauthorized()` dipanggil.
