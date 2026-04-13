# 🛠️ Scaffolding & Archiving Guide

Dokumentasi ini menjelaskan cara mengelola fitur, tenant, dan kustomisasi dalam arsitektur **Modular Multi-Tenant SIMRS**.


## 1. Membuat Fitur Baru (Vertical Slice)

Untuk membuat kerangka fitur baru secara otomatis di ketiga layer (Core, Infra, Presentation), gunakan perintah:

```bash
pnpm create:feature [nama-fitur] [nama-modul]
```

*Contoh:* `pnpm create:feature unit simrs`

### Apa yang Terbentuk?
- **Core**: Folder vertikal untuk logic bisnis.
- **Infrastructure**: Folder vertikal untuk implementation & repositories.
- **Presentation**: Folder hybrid (Level 2) yang berisi:
  - `index.ts` (Entry point)
  - `[feature].routes.ts` (Definisi rute standar)
  - `components/` (Laci UI)
  - `composables/` (Laci Logika UI)

---

## 2. Onboarding Tenant Baru

Untuk mendaftarkan RS/Client baru ke dalam monorepo, gunakan perintah:

```bash
pnpm create:tenant [nama-tenant]
```

*Contoh:* `pnpm create:tenant rspku`

### Hasilnya:
- **Presentation**: Membuat `manifest.ts` (Smart Clone dari base) di folder `_tenants/[tenant]`.
- **Config**: Membuat file `.env.[tenant]` di aplikasi terminal (Vite mode).
- **Core/Infra**: Membuat folder root tenant untuk standarisasi.

---

## 3. Membuat Kustomisasi Tenant (Extension Point)

Jika satu tenant butuh fitur kustom atau rute tambahan yang tidak ada di base, gunakan perintah:

```bash
pnpm create:custom [nama-tenant] [nama-fitur]
```

*Contoh:* `pnpm create:custom rspku unit`

### Hasilnya:
Membangun folder kustomisasi di dalam folder tenant tersebut pada ketiga layer. Di layer **Presentation**, otomatis dibuatkan:
- `extra.routes.ts`: Template rute kustom yang **otomatis terdeteksi** oleh sistem tanpa perlu register di manifest.
- `index.ts`: Barrel file untuk ekspor kustomisasi.

---

## 4. Membuat Arsip Versi (Legacy Snapshot)

Jika Bosku ingin "membekukan" versi fitur tertentu (misal sebelum melakukan update besar), gunakan perintah:

```bash
pnpm create:archive [nama-modul] [nama-fitur] [versi]
```

*Contoh:* `pnpm create:archive simrs staff v1.1.0`

### Cara Kerjanya:
- Script akan menyalin seluruh folder fitur dari `base` ke folder `_archives/[fitur]/[versi]` di semua layer.
- Versi asli di folder `base` tetap ada dan bisa lanjut dikembangkan.
- Gunakan folder `_archives` ini sebagai referensi untuk tenant yang ingin dikunci versinya.

---

## 5. Mengatur Versi Tenant

Setelah melakukan `create:archive`, Bosku bisa mengatur versi mana yang aktif untuk tiap tenant di file `manifest.ts` masing-masing:

```typescript
// features/presentation/src/simrs/_tenants/rspku/manifest.ts
export const activeModules = [
  { name: 'unit', version: '1.0.0' }, // Menggunakan versi arsip
  { name: 'staff', version: 'latest' }, // Menggunakan versi terbaru di base
];
```

---

## 6. Strategi Prioritas & Override (Rute)

Sistem menggunakan **Solusi 2 (Override/Merging)** untuk menangani konflik rute antara `base` dan kustoman tenant.

### Prinsip Kerja:
Jika ada rute dengan **path yang sama** antara `base` dan `extra.routes.ts`, maka rute milik **tenant (Extra) yang akan menang**. Ini memungkinkan RS untuk memiliki tampilan kustom pada halaman tertentu tapi tetap menggunakan fitur standar pada halaman lainnya.

### Urutan Prioritas (Top-to-Bottom):
1.  🥇 **Global Extra Routes**: Rute di root tenant (`_tenants/rspku/extra.routes.ts`).
2.  🥈 **Feature Extra Routes**: Rute kustom per fitur (`_tenants/rspku/unit/extra.routes.ts`).
3.  🥉 **Base / Archive Routes**: Rute standar produk dari folder `base` atau versi arsip.

---

## Prinsip Penting:
1. **Vertical Slice**: Satu fitur, satu nafas di semua layer.
2. **No Conflict**: Gunakan `_archives` untuk pemisahan data lama agar folder `base` tetap bersih.
3. **Automated**: Gunakan script scaffolder agar struktur folder selalu konsisten dan sesuai standar arsitektur.
4. **Override Strategy**: Rute di `extra.routes.ts` selalu diutamakan untuk mendukung kustomisasi tanpa breaking change.
