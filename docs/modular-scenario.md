# Modular SIMRS: Architectural Scenarios

> Referensi Strategi Multi-Tenant & Penambahan Fitur

Dokumen ini menjelaskan bagaimana menangani berbagai skenario perubahan dalam arsitektur SIMRS modular kita.

---

## 🛠️ Prinsip Utama

1. **Sacred Base**: Folder `base/` adalah produk standar. JANGAN mengedit file di sini untuk kebutuhan khusus satu tenant.
2. **Tenant Overrides**: Gunakan folder `_tenants/{code}/` untuk semua kustomisasi.
3. **Convention Over Configuration**: Nama rute dan manifest harus sinkron agar automasi berjalan.

---

## 📂 Struktur Penting

```
features/presentation/src/simrs/
├── base/                  ← Produk Standar (Read-Only untuk Custom)
│   ├── manifest.ts        ← List fitur default
│   ├── pages/             ← UI Standar
│   └── routes/            ← Routing Standar (*.routes.ts & *.extra.ts)
└── _tenants/{tenant}/     ← Folder Kustomisasi Client
    ├── manifest.ts        ← Pilih fitur aktif untuk tenant ini
    ├── pages/             ← UI Kustom (Override atau New)
    └── routes/            ← Routing Kustom (*.routes.ts & *.extra.ts)
```

---

## 🚀 Skenario Umum

### 1. Ganti Tampilan (Override Base UI)

**Kasus**: RS PKU ingin tampilan halaman Unit berbeda dari standar.

- **Tindakan**: Buat file dengan path identik di folder tenant.
- **Lokasi**: `_tenants/rspku/pages/unit/Unit.vue`
- **Hasil**: Vite otomatis memilih file ini saat build mode `rspku`. Tidak perlu ubah routing.

### 2. Tambah Halaman di Modul yang Ada (Extension)

**Kasus**: Modul Unit RS PKU butuh halaman khusus "Cost Control" yang RS lain tidak punya.

- **Tindakan**:
  1. Buat UI: `_tenants/rspku/pages/unit/CostControl.vue`.
  2. Daftarkan rute di file ekstra: `_tenants/rspku/routes/unit.extra.ts`.
- **Hasil**: Halaman baru aktif eksklusif hanya untuk RS PKU. Folder `base` tetap bersih.

### 3. Tambah Fitur/Modul Baru (Exclusive Module)

**Kasus**: RS PKU minta modul baru "Inventory" (belum ada di base).

- **Tindakan**:
  1. Buat folder `_tenants/rspku/routes/inventory.routes.ts`.
  2. Tambahkan modul di manifest: `_tenants/rspku/manifest.ts` → tambahkan `'inventory'`.
- **Hasil**: Modul akan dideteksi otomatis oleh `virtual:page-registry` dan didaftarkan ke router.

### 4. Pilih-Pilih Fitur (Feature Toggling)

**Kasus**: RS Bunda hanya menyewa modul `unit`, tidak mau ada modul `staff`.

- **Tindakan**: Edit `_tenants/rsbunda/manifest.ts` dan hapus `'staff'` dari array `activeModules`.
- **Hasil**: Router tidak akan meload modul `staff`, dan Vite akan membuang (tree-shake) semua kode `staff` dari bundle build RS Bunda.

---

## ⚡ Automasi (Scaffolding)

Untuk mempercepat pembuatan struktur tenant baru:

```bash
pnpm create:tenant [nama-rs]
```

Script ini akan membuat folder `_tenants`, menyalin manifest standar, dan menyiapkan file `.env` di aplikasi shell.

---

## 🧠 Solusi Teknis Terapan

- **`tenantResolver` (Vite Plugin)**: Jantung arsitektur yang menangani alias `@page/` dan resolusi file dinamis.
- **`virtual:page-registry`**: Modul virtual yang mengotomatisasi pengumpulan rute agar `app-router.ts` tetap tipis dan bersih.
- **`*.extra.ts` (Extension Points)**: Mekanisme untuk menambahkan sub-rute ke modul yang sudah ada atau mendefinisikan modul eksklusif tanpa menyentuh file rute utama (`*.routes.ts`)

---

## 📉 Hasil Riset Bundling & Tree-Shaking (Data Riil)

Berdasarkan hasil uji build pada `2026-04-10` untuk mode `rspku`, arsitektur ini terbukti menghasilkan bundle yang sangat optimal.

### 1. Bukti Tree-Shaking Efektif
Modul yang ada di `base/routes` tapi tidak didaftarkan di `manifest.ts` tenant (seperti **Dashboard**) terbukti **hilang total** dari bundle. Tidak ada chunk JS yang dibuat untuk modul tersebut.

### 2. Bukti Modul Eksklusif Ter-Bundle
Modul **Billing** dan **ExtraPage** yang hanya ada di folder `_tenants/rspku/` berhasil dideteksi dan dibuatkan chunk tersendiri secara otomatis via mekanisme `.extra.ts`.

### 3. Statistik Bundle (Tenant: RS PKU)
| Asset | Size (Gzip) | Keterangan |
|---|---|---|
| `Main Bundle` | 40.10 kB | Vendor & Shared Logic |
| `Global CSS` | 11.64 kB | Tailwind v4 Styles |
| **`Billing.js`** | **0.21 kB** | **Non-Generic PKU Module** |
| **`ExtraPage.js`** | **0.21 kB** | **Tenant Specific Page** |
| `Unit.js` | 0.21 kB | Standard Module (Inherited) |
| `Staff.js` | 0.20 kB | Standard Module (Inherited) |

> [!TIP]
> Dengan hasil ini, performa aplikasi tetap maksimal meskipun jumlah tenant bertambah ribuan, karena browser user hanya mengunduh kode yang bener-bener dia butuhkan sesuai manifest yang disewa.

---

## 🏷️ Strategi Versioning

Mengingat arsitektur kita menggabungkan satu **Base Engine** dengan ratusan **Tenant Overrides**, kita menggunakan strategi **Hybrid Versioning**.

### 1. Engine & Base Product (SemVer)
Didefinisikan di `package.json` root. Mengikuti aturan Semantic Versioning:
- **Major**: Perubahan arsitektur besar (misal: ganti build tool, upgrade framework mayor).
- **Minor**: Penambahan fitur baru di level `base` yang tersedia untuk semua tenant.
- **Patch**: Perbaikan bug pada logic generic di `base/`.

### 2. Tenant Revision (The Suffix)
Setiap tenant tidak memiliki SemVer mandiri, melainkan menggunakan **Revision Identifier** yang menempel pada versi base.
- **Format**: `v[BaseVersion]+[TenantCode].rev-[Count]`
- **Contoh**: `v2.4.1+rspku.rev-12`
- **Kegunaan**: Melacak sudah berapa kali folder `_tenants/rspku` mengalami perubahan tanpa harus menaikkan versi produk utama.

### 3. Git Tagging Convention
- **Produk**: `base-v2.1.0` (Titik stabil product roadmap).
- **Deployment**: `deploy/[tenant-code]/[yyyy-mm-dd]` (Snapshot rilis ke server client).

### 4. Manifest Schema Version
Setiap file `manifest.ts` disarankan memiliki property `schemaVersion: number`. Ini berguna untuk mendeteksi apakah struktur manifest suatu tenant masih kompatibel dengan cara baca `tenant-resolver` (Vite Plugin) versi terbaru.
