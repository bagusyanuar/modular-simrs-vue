# HTTP SDK Documentation

SDK ini adalah wrapper Axios yang dirancang untuk arsitektur modular Genossys Hospital. Fokus utama SDK ini adalah keamanan (Auth flow), standarisasi error, dan fleksibilitas tinggi (Agnostic).

## Fitur Utama

1.  **Zero Any Policy**: 100% Type-safe menggunakan TypeScript Generics.
2.  **Smart Auth Interceptor**: Injeksi token otomatis dan antrean refresh token (mencegah *race condition*).
3.  **Agnostic Design**: Tidak terikat pada struktur backend tertentu (User bebas melakukan transformasi data).
4.  **Flexible Hooks**: Mudah diintegrasikan dengan Pinia, Cookie, atau State Management lainnya.

## Inisialisasi Dasar

Buat instance `HttpClient` di level infrastructure:

```typescript
import { HttpClient } from '@genossys-hospital/http-sdk';

export const http = new HttpClient({
  baseURL: 'https://api.hospital.com',
  timeout: 15000,
  hooks: {
    getToken: () => localStorage.getItem('access_token'),
  }
});
```

## Integrasi dengan SSO SDK (Recomended)

Gunakan `SSOClient` untuk menangani refresh token secara otomatis:

```typescript
import { HttpClient } from '@genossys-hospital/http-sdk';
import { auth } from './auth'; // Instance SSOClient

export const api = new HttpClient({
  baseURL: import.meta.env.VITE_API_URL,
  hooks: {
    getToken: () => auth.getAccessToken(),
    onRefreshToken: () => auth.checkSilentLogin(), // Atau logic refresh token lainnya
    onUnauthorized: () => {
       auth.logout();
       window.location.href = '/login';
    }
  }
});
```

## Menangani Transformasi Data (Unwrapping)

Karena SDK ini bersifat agnostic, jika Anda ingin otomatis membongkar response `{ success, data, message }`, Anda bisa menambahkan interceptor sendiri:

```typescript
api.instance.interceptors.response.use((response) => {
  const { data } = response;
  
  // Logic bongkar data Genossys
  if (data && data.success) {
    return { ...response, data: data.data };
  }
  
  return response;
});

// Sekarang get<T> akan langsung mengembalikan T (isinya data.data)
const user = await api.get<UserEntity>('/me');
```

## Error Handling

SDK menyediakan class `HttpError` yang seragam:

```typescript
try {
  const data = await api.get('/path');
} catch (error) {
  if (error instanceof HttpError) {
    console.error(`API Error ${error.code}: ${error.message}`);
  }
}
```

---

**Package**: `@genossys-hospital/http-sdk`
**Dependencies**: `axios`
