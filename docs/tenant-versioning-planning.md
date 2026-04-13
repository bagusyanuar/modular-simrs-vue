# Planning: Versioned Manifest Architecture

Dokumen ini berisi rancangan ide dan roadmap arsitektur untuk pengembangan sistem resolusi multi-tenant selanjutnya.

## Latar Belakang Masalah
Saat ini, mekanisme rujukan versi komponen lama bagi tenant yang belum mau mengadopsi fungsionalitas baru (Tenant Upgrade Lag) disiasati dengan penempatan "File Proxy" (misal: `<script>import V1 from '@base/legacy/unit/Unit.vue'</script>`) di dalam direktori `_tenants` dari tiap RS.
Meski stabil, ini mengharuskan intervensi manual developer ke dalam direktori rute tenant yang bersangkutan.

## Solusi Impian: Versioned Manifest (Sistem "Package.json" Internal)
Untuk menghapuskan jejak *"Proxy Manual"*, kontrol versi akan dialihkan sepenuhnya pada konfigurasi satu pintu di manifest tenant.

**Format Masa Depan (Ekspektasi):**
```typescript
// _tenants/rspku/manifest.ts
export const activeModulesVersioned = [
  { name: 'unit', version: '1.0.0' }, // Membaca dari folder legacy v1
  { name: 'staff', version: 'latest' }, // Otomatis mengarah ke latest base/
  { name: 'billing', version: '1.0.0' },
];
```

## Perubahan Arsitektur yang Dibutuhkan

Jika ide ini akan diimplementasi di masa depan, sistem harus melalui 3 perombakan berikut:

### 1. Refactor Root Config Parsing (`vite-plugin-tenant.ts`)
- **Kendala Terkini**: Script `vite-plugin-tenant.ts` menggunakan pola Regex murni (`/activeModules\s*=\s*\[([\s\S]*?)\]/`) untuk mem-parsing array satu dimensi berupa deret *string* modul, sehingga sangat tidak andal bila digunakan mem-parsing wujud *Array of Object* baru.
- **Roadmap Penyelesaian**:
  - *Opsi A*: Mengubah ekstensi manifest target dari Typescript (`manifest.ts`) murni menjadi konfigurasi JSON statis (`manifest.json`) sehingga plugin Vite mendapat kapabilitas `JSON.parse` instan dan andal.
  - *Opsi B*: Menyisipkan library evaluator seperti `jiti` di Vite Plugin untuk meng-*compile* dan mem-*parse* AST file *.ts* tersebut pada *runtime*. 

### 2. Standarisasi Folder Legacy Core
Standarisasi penempatan komponen fisik *"old feature"* perlu disepakati menggunakan *suffix* versi.
- Fitur terbaru selalu dirilis merata dan menempati root modul: `base/pages/unit/`
- Begitu versi mutakhir meluncur, folder versi lama dikurung dan dipindanalihkan menuju struktur bersarang seperti `base/legacy/unit/v1.0.0/`.

### 3. Dynamic Virtual Routing
`vite-plugin-tenant.ts` akan diberi kesadaran (awareness) *versioning*.
Flow resolusi `@page/` akan menjadi:
1. Cari module di Tenant Overrides (`_tenants/rspku/pages/unit`)
2. Jika kosong dan versinya bukan *latest*, cari di (`base/legacy/unit/v1.0.0/`)
3. Jika versinya *latest* (atau tidak ada definisi versi), asumsikan mengarah mutlak ke Base (`base/pages/unit/`)

### 4. Bundling & Tree-Shaking Optimization (`virtual:page-registry`)
Fungsi `generateRegistry()` di dalam plugin harus dimodifikasi agar meng-*inject* *dynamic imports* sesuai dengan versi yang ditarik dari manifest.
- Aliasing untuk proses *bundling* harus memastikan Vite hanya akan menarik rute dari versi spesifik yang diminta (misal prioritas `routes/unit.routes` di dalam folder `unit/v1.0.0`).
- Versi komponen lain yang tidak dideklarasikan spesifik oleh tenant tersebut akan dibuang oleh *bundler* pada proses *Tree-Shaking*, sehingga ukuran aset aplikasi tetap super ringan tanpa terbebani *"dead code"* dari masa purbakala maupun fitur masa depan yang belum diadopsi.

### 5. Transformasi ke Feature-Sliced Design (Core & Infra)
Arsitektur layer `features/core` dan `features/infrastructure` yang saat ini berbasis *Clean Architecture Layers* (mengelompokkan `usecases/`, `repositories/` secara horizontal) wajib dirombak menjadi **Vertical Slices (Feature-Sliced Design)**.
- **Struktur Impian**: `features/core/src/simrs/base/[nama-fitur]/usecases/`
- **Alasan**: Pemetaan versi modul via `manifest.ts` tidak akan ada artinya di sisi logika jika kode `core` tidak dikelompokkan per fitur. Pemisahan vertikal ini menjamin proses *Tree-Shaking* sukses membuang tuntas 100% kode `core` dan `infra` dari fitur yang tidak disewa oleh *tenant*. Selain itu, penyediaan folder `legacy/[fitur]/v1.0.0/` untuk sebuah *layer backend* akan sama rapinya dengan *layer UI*.

---
**Status Dokumen**: *Draft & Blueprint Idea*
**Tindak Lanjut**: Menunggu validasi opsi struktur *parsing* (JSON vs Typescript) serta *greenlight* untuk refactoring besar-besaran *Core/Infra* menuju arsitektur *Feature-Sliced*.
