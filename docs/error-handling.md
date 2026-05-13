# Error Handling Standard: Neurovi V2 Frontend

Dokumen ini menjelaskan standar penanganan error di Neurovi V2. Kita menggunakan sistem **Centralized & Typed Error** untuk memastikan konsistensi antara layer Core, Infrastructure, dan Presentation.

---

## 1. Hierarchy & Types

Semua error dalam aplikasi harus diturunkan dari class `AppError` yang berada di `modules/core`.

### **Core Errors**

Lokasi: `modules/core/src/libs/error.ts`

| Class               | HTTP Status | Kegunaan                                        |
| :------------------ | :---------- | :---------------------------------------------- |
| `AppError`          | (Base)      | Base class untuk semua application error.       |
| `BadRequestError`   | 400         | Client mengirim request yang tidak valid.       |
| `UnauthorizedError` | 401         | Sesi berakhir atau login gagal.                 |
| `ForbiddenError`    | 403         | User tidak memiliki akses ke resource tersebut. |
| `NotFoundError`     | 404         | Data tidak ditemukan.                           |
| `ValidationError`   | 422         | Error validasi dari Backend (biasanya form).    |
| `ServerError`       | 500         | Kesalahan internal server.                      |
| `NetworkError`      | 0           | Masalah koneksi internet.                       |

---

## 2. Layer Responsibilities

### **Infrastructure Layer**

Layer ini bertanggung jawab untuk menangkap error dari external (API/SDK) dan mengubahnya (**mapping**) menjadi `AppError`.

**Aturan:**

- Gunakan `handleAppError` wrapper di Repository.
- Jangan biarkan error Axios/SDK bocor ke layer Presentation.

```typescript
// modules/infrastructure/src/auth/auth.repository.ts
import { handleAppError } from '../../libs/error';

export class AuthRepository {
  async login(input: LoginInput) {
    return handleAppError(async () => {
      const response = await this.sdk.post('/login', input);
      return response.data;
    });
  }
}
```

### **Presentation Layer**

Layer ini bertanggung jawab untuk menampilkan error ke user dalam bentuk UI (Toast, Notification, atau inline Validation).

**Aturan:**

- Gunakan type guarding `AppError.isAppError(err)`.
- Untuk error 422, mapping kembali ke state form (misal: `vee-validate`).

```typescript
// Presentation component / composable
try {
  await authUsecase.login(data);
} catch (err) {
  if (AppError.isAppError(err)) {
    if (err instanceof ValidationError) {
      // Set error ke form field secara otomatis
      form.setErrors(err.details);
    } else {
      // Tampilkan toast
      toast.error(err.message);
    }
  }
}
```

---

## 3. Infrastructure Error Mapper

Lokasi: `modules/infrastructure/src/libs/error.ts`

Infrastructure layer bertindak sebagai "filter" agar error teknis (seperti Axios error) tidak mengotori domain logic. Kita menggunakan `ErrorMapper` untuk konversi otomatis.

### **ErrorMapper.toDomain**

Method ini mendeteksi jenis error dan mengonversinya ke class `AppError` yang sesuai:

- **HttpError**: Dipetakan berdasarkan status code (401 -> `UnauthorizedError`, 422 -> `ValidationError`, dsb).
- **Generic Error**: Error yang tidak dikenal akan dibungkus menjadi `AppError` dengan code `UNEXPECTED_ERROR`.

### **Handling Validation (422)**

Khusus untuk error 422, `ErrorMapper` akan mencoba mengekstrak field `errors` dari response body untuk dimasukkan ke dalam property `details` di `ValidationError`.

### **handleAppError Utility**

Gunakan wrapper ini di setiap pemanggilan API di Repository untuk memastikan error yang dilempar selalu bertipe `AppError`.

```typescript
export async function handleAppError<T>(task: () => Promise<T>): Promise<T> {
  try {
    return await task();
  } catch (err) {
    // Otomatis convert ke AppError
    throw ErrorMapper.toDomain(err);
  }
}
```

### **Custom Error Messages (Manual Handling)**
Jika butuh pesan error yang lebih spesifik daripada default dari API/Mapper, lakukan `try-catch` secara manual tanpa wrapper `handleAppError`.

```typescript
// modules/infrastructure/src/auth/auth.repository.ts

async login(input: LoginInput) {
  try {
    const response = await this.sdk.post('/login', input);
    return response.data;
  } catch (err) {
    // Contoh: Override message khusus untuk login
    if (err instanceof HttpError && err.status === 401) {
      throw new UnauthorizedError('Username atau Password salah. Silakan coba lagi.');
    }
    
    // Fallback ke mapper jika tidak butuh custom logic
    throw ErrorMapper.toDomain(err);
  }
}
```

---

## 4. Best Practices

1. **Specific Catching**: Selalu cek tipe error sebelum melakukan tindakan. Jangan gunakan `any`.
2. **User Friendly Messages**: `AppError` di level core sudah memiliki default message bahasa Indonesia. Gunakan itu kecuali butuh kustomisasi spesifik.
3. **Capture Stack Trace**: `AppError` sudah dikonfigurasi untuk menyimpan stack trace agar mempermudah debugging di development mode.
4. **Validation Details**: `ValidationError` menyimpan detail error dalam property `details` dengan format `Record<string, string | string[]>`.

---

## 4. Why this matters?

- **Consistency**: Semua developer memberikan feedback yang sama ke user.
- **Type Safety**: Kita tahu persis properti apa yang tersedia (misal: `.code`, `.statusCode`, `.details`).
- **Maintainability**: Jika struktur error dari Backend berubah, kita hanya perlu update di `ErrorMapper` (Infrastructure), bukan di ribuan file `.vue`.
