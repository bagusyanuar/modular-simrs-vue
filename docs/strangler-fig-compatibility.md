# Strangler Fig Pattern Compatibility Report
> **Status:** Fully Supported | **Architecture:** Modular Monorepo V2

Dokumen ini menjelaskan bagaimana arsitektur `modular-simrs-vue` mendukung migrasi bertahap dari sistem legacy (V1) ke sistem baru (V2) secara seamless.

---

## 🏗️ Architectural Alignment

Arsitektur kita saat ini memiliki 4 pilar utama yang mendukung strategi migrasi bertahap:

### 1. Unified Session Management (Shared Storage)
Arsitektur kita menggunakan **Cookie** sebagai media penyimpanan session utama.

#### Kenapa Cookie, Bukan LocalStorage?
| Fitur | Cookie ✅ | LocalStorage ❌ |
|---|---|---|
| **Cross-Subdomain** | Bisa dishare antar `app1.rs.com` dan `app2.rs.com`. | **Terisolasi** total per origin. |
| **Pindah Versi (Seamless)** | Browser otomatis nenteng datanya pas redirect. | Perlu logic khusus buat hand-over data. |
| **Security (CSRF vs XSS)** | Bisa diproteksi `SameSite` & `HttpOnly`. | Sangat rentan disedot via **XSS**. |
| **Interoperabilitas** | Aplikasi legacy (V1) sangat umum pakai Cookie. | Kadang beda format/struktur data. |

### 2. Relocatable Routing (`BASE_URL`)
Penggunaan `createWebHistory(import.meta.env.BASE_URL)` di `apps/simrs/src/routes/app-router.ts` memungkinkan V2 dihost di subpath tertentu.
- **Mekanisme**: Nginx mengarahkan traffic `/unit` ke V2, sementara `/` tetap ke V1.
- **Keuntungan**: Tidak perlu rewrite seluruh rute sekaligus.

### 3. Tenant-Aware Isolation
Sistem `_tenants/` memungkinkan rilis fitur V2 dilakukan secara bertahap per client (RS).
- **Mekanisme**: RS PKU bisa pakai modul Unit V2, sementara RS Bunda tetap di V1 sampai mereka siap migrasi.

### 4. Shared UI Library (`@genrs/ui`)
Visual jomplang antara V1 dan V2 bisa dimitigasi dengan penggunaan library UI yang sama, menciptakan ilusi visual satu aplikasi yang utuh.

---

## 💡 Saran Teknis: External Fallback Pattern

Untuk membuat transisi antar versi aplikasi terasa "tidak ada bedanya", kita butuh mekanisme **Fallback** jika user mengakses rute yang belum di-rewrite di V2.

### Skenario:
User berada di halaman V2 (Unit), lalu meng-klik rute "Laporan" yang ternyata masih ada di V1.

### Implementasi di `app-router.ts`:
Kita bisa menambahkan rute "Catch-all" di tingkat paling bawah router V2:

```typescript
// apps/simrs/src/routes/app-router.ts

const V1_BASE_URL = 'https://simrs-v1.test'; // URL aplikasi legacy

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ... rute V2 yang sudah di-rewrite
    {
      path: '/:pathMatch(.*)*',
      name: 'ExternalFallback',
      component: { render: () => null }, // Komponen kosong
      beforeEnter: (to) => {
        // Redirect balik ke V1 jika rute tidak ditemukan di V2
        window.location.href = `${V1_BASE_URL}${to.fullPath}`;
      }
    }
  ]
});
```

### Rekomendasi Alur Navigasi:
1. **Reverse Proxy (Nginx/Gateway)**: Selalu menjadi filter pertama. 
   - Jika path ada di daftar rute V2 -> arahkan ke V2.
   - Selain itu -> arahkan ke V1.
2. **Client-side Fallback**: Jika rute V2 terpanggil tapi modul-nya tidak aktif (lewat `manifest.ts`), router akan memicu redirect balik ke V1 sesuai kode di atas.

---

## 🚀 Roadmap Migrasi Disarankan

1. **Step 1: Auth Sync**. Pastikan V1 dan V2 pakai format token/cookie yang sama.
2. **Step 2: Reverse Proxy Setup**. Siapkan Nginx untuk membelah traffic berdasarkan path.
3. **Step 3: Feature Migration**. Rewrite modul per modul (mulai dari `unit`).
4. **Step 4: The Tipping Point**. Setelah >70% modul dipindah, jadikan V2 sebagai root (`/`) dan biarkan V1 menjadi legacy subpath.

> [!TIP]
> Prioritaskan modul yang paling jarang berubah (*cold modules*) untuk testing awal, atau modul yang paling sering bermasalah di V1 sebagai *quick win* migrasi.

---

## 🛠️ Implementation Guide for V1 (Legacy)

Agar V2 bisa mengenali session dari V1, tambahkan logic berikut pada bagian sukses login di aplikasi V1:

```javascript
// Contoh di Aplikasi V1 (Legacy)
function onLoginSuccess(token) {
  // Set cookie agar bisa dibaca oleh V2 (Monorepo)
  // Pastikan nama cookie sama dengan yang diatur di SessionManager V2
  const cookieName = 'access_token';
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // 7 hari

  document.cookie = `${cookieName}=${token}; expires=${expiry.toUTCString()}; path=/; domain=.rs-pusat.com; SameSite=Lax`;
  
  console.log('✅ Token shared with V2 ecosystem');
}
```

**Penting:**
- **Domain**: Gunakan dot prefix (misal `.rs.com`) jika V1 dan V2 beda subdomain.
- **Path**: Harus `/` agar bisa dibaca di semua path aplikasi.
- **Secure**: Set `Secure` jika aplikasi berjalan di HTTPS.
