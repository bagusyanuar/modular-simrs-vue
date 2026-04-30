# HTTP SDK Documentation

SDK ini adalah wrapper Axios yang dirancang untuk arsitektur modular Genossys Hospital. Fokus utama SDK ini adalah keamanan (Auth flow), standarisasi error, dan fleksibilitas tinggi (Agnostic).

## Fitur Utama

1.  **Zero Any Policy**: 100% Type-safe menggunakan TypeScript.
2.  **Smart Auth Interceptor**: Injeksi token otomatis dan antrean refresh token (mencegah *race condition*).
3.  **HttpError Normalization**: Otomatis mengubah `AxiosError` menjadi `HttpError` yang seragam, menyembunyikan detail library pihak ketiga dari logic bisnis.
4.  **Zero Axios Leakage**: Layer di atas SDK tidak perlu meng-import Axios untuk menangani error atau hooks.
5.  **Flexible Hooks**: Mendukung custom logic untuk request, refresh token, dan error handling.

## Inisialisasi Dasar

Buat instance `HttpClient` di level infrastructure:

```typescript
import { HttpClient } from '@genossys-hospital/http-sdk';

export const http = new HttpClient({
  baseURL: 'https://api.hospital.com',
  timeout: 15000,
  hooks: {
    getToken: () => localStorage.getItem('access_token'),
    // Hook baru untuk modifikasi request secara global
    onRequest: (config) => {
      config.headers['X-Hospital-Code'] = 'RS001';
      return config;
    }
  }
});
```

## Integrasi dengan SSO SDK (Recommended)

Gunakan `SSOClient` untuk menangani refresh token secara otomatis:

```typescript
import { HttpClient, HttpError } from '@genossys-hospital/http-sdk';
import { auth } from './auth'; // Instance SSOClient

export const api = new HttpClient({
  baseURL: import.meta.env.VITE_API_URL,
  hooks: {
    getToken: () => auth.getAccessToken(),
    onRefreshToken: () => auth.checkSilentLogin(), 
    // Menggunakan HttpError (Bukan AxiosError)
    onUnauthorized: (error: HttpError) => {
       auth.logout();
       window.location.href = '/login';
    },
    // Menentukan kapan refresh token harus di-trigger
    shouldRefreshToken: (error) => error.status === 401 || error.code === 'TOKEN_EXPIRED'
  }
});
```

## Standardized Methods

SDK menyediakan method standar dan versi `Raw` jika Anda membutuhkan full response (headers/status):

| Standard (Return Data) | Raw (Return AxiosResponse) |
| :--- | :--- |
| `api.get<T>(url, config)` | `api.getRaw<T>(url, config)` |
| `api.post<T>(url, data, config)` | `api.postRaw<T>(url, data, config)` |
| `api.put<T>(url, data, config)` | `api.putRaw<T>(url, data, config)` |
| `api.patch<T>(url, data, config)` | `api.patchRaw<T>(url, data, config)` |
| `api.delete<T>(url, config)` | `api.deleteRaw<T>(url, config)` |

## Error Handling

SDK menyediakan class `HttpError` yang seragam. **Penting:** Semua error yang keluar dari SDK ini sudah berupa `HttpError`.

```typescript
import { HttpError } from '@genossys-hospital/http-sdk';

try {
  const data = await api.get('/path');
} catch (error) {
  if (error instanceof HttpError) {
    // Properti HttpError: message, status, code, originalError
    console.error(`API Error ${error.code} (${error.status}): ${error.message}`);
  }
}
```

---

**Package**: `@genossys-hospital/http-sdk`
**Dependencies**: `axios` (Internal only)
