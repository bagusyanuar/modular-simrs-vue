# Local SSL Setup Guide (mkcert)

Panduan setting HTTPS di environment lokal menggunakan `mkcert`. Penting untuk fitur SSO dan Cookies (`Secure`, `SameSite=None`).

## 1. Install mkcert

Pilih salah satu sesuai package manager yang terinstall:

### Windows (Chocolatey)
```powershell
choco install mkcert
mkcert -install
```

### Windows (Scoop)
```powershell
scoop install mkcert
mkcert -install
```

## 2. Update Hosts File

Tambahkan domain lokal ke `C:\Windows\System32\drivers\etc\hosts`:

```text
127.0.0.1 neurovi-local.test
```

## 3. Generate Certificate

Jalankan di root folder project (disimpan di folder `ssl/`):

```powershell
mkdir ssl
cd ssl
mkcert neurovi-local.test
```

Ini akan menghasilkan file:
- `neurovi-local.test.pem`
- `neurovi-local.test-key.pem`

## 4. Konfigurasi Vite

Update `vite.config.ts` di masing-masing aplikasi:

```typescript
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  server: {
    host: 'neurovi-local.test',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../../ssl/neurovi-local.test-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../../ssl/neurovi-local.test.pem')),
    },
    origin: 'https://neurovi-local.test:5173',
  },
});
```

## 5. Troubleshooting

- **Browser Tetap Warning**: Pastikan sudah menjalankan `mkcert -install` di terminal dengan akses Administrator.
- **CORS/HMR Error**: Pastikan `origin` di vite config sudah menggunakan protokol `https`.
- **Mixed Content**: Jika aplikasi memanggil API HTTP (non-secure), browser mungkin akan memblokir request tersebut. Pastikan API juga menggunakan HTTPS atau domain yang sama via proxy.
