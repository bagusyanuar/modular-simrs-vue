# Roadmap Refactoring: Modular Multi-Tenant SIMRS

Dokumen ini menjelaskan tahapan (phases) transformasi arsitektur dari pola *Layered Architecture* menuju *Vertical Slice Architecture (Feature-Sliced Design)* guna mendukung sistem versioning yang presisi dan isolasi tenant tingkat tinggi.

---

## 📅 Phase 1: Core Layer Refactoring (Target: `features/core`)
**Tujuan**: Mengisolasi logika bisnis (Domain & Usecase) berdasarkan fitur.

- **Struktur Baru**:
  - `features/core/src/simrs/base/[feature]/domains/`
  - `features/core/src/simrs/base/[feature]/usecases/`
- **Tindakan**:
  - Reorganisasi file `unit`, `staff`, `billing` dsb ke dalam folder fiturnya masing-masing.
  - Penyesuaian `index.ts` (Barrel) di tiap folder fitur.
  - Update Path Alias di `tsconfig.base.json` agar tetap sinkron.

---

## 📅 Phase 2: Infrastructure Layer Refactoring (Target: `features/infrastructure`)
**Tujuan**: Mengisolasi lapisan data (Repository, Mapper, Schema) berdasarkan fitur.

- **Struktur Baru**:
  - `features/infrastructure/src/simrs/base/[feature]/repositories/`
  - `features/infrastructure/src/simrs/base/[feature]/mappers/`
  - `features/infrastructure/src/simrs/base/[feature]/schemas/`
- **Tindakan**:
  - Migrasi implementasi repository dan schema database ke dalam folder fitur yang sesuai.
  - Memastikan dependensi antar fitur tetap minimal (menghindari circular dependency).

---

## 📅 Phase 3: Tenant Logic Overrides
**Tujuan**: Memungkinkan kustomisasi logika bisnis khusus untuk tenant tertentu tanpa merusak kode Base.

- **Mekanisme**:
  - Mengaktifkan folder `_tenants/[tenant]/[feature]/` di dalam layer Core dan Infrastructure.
  - Menyamakan struktur folder `_tenants` agar identik dengan `base` untuk mempermudah resolusi otomatis oleh build tool.

---

## 📅 Phase 4: Vite Plugin Dynamic Resolver (The "Dewa" Internal)
**Tujuan**: Mengotomatisasi pemilihan file (Tenant vs Legacy vs Base) di semua pilar aplikasi.

- **Tindakan**:
  - Upgrade `features/presentation/vite-plugin-tenant.ts` untuk mendukung manipulasi alias `@genrs/core` dan `@genrs/infrastructure`.
  - Integrasi dengan `activeModulesVersioned` di `manifest.ts` tenant.
  - Implementasi logika fallback: **Tenant Override > Legacy Version > Base Latest**.

---

## 📅 Phase 5: Legacy & Versioning Automation
**Tujuan**: Menjamin stabilitas bagi tenant yang belum siap upgrade fitur (Legacy Support).

- **Struktur**:
  - `base/legacy/[feature]/v[version]/` (Berlaku di Presentation, Core, dan Infra).
- **Tindakan**:
  - Pembuatan script automasi `scripts/quarantine-feature.mjs` untuk memindahkan folder fitur ke folder legacy saat terjadi *Major Enhancement*.
  - Pembersihan (*cleanup*) folder legacy secara berkala jika sudah tidak ada tenant yang menggunakannya.

---

## 🛡️ Prinsip Keamanan & Performa
1. **Zero Dead Code**: Dengan arsitektur ini, kode fitur yang tidak aktif tidak akan masuk ke dalam bundle JS akhir (Tree-Shaking Maksimal).
2. **Type Safety**: Penggunaan alias tetap harus dipandu oleh Typescript agar tidak terjadi *runtime error* saat resolusi module.
3. **Single Source of Truth**: Seluruh konfigurasi versi modul hanya ada di `manifest.ts` tiap tenant.

> [!NOTE]
> Roadmap ini adalah dokumen hidup. Setiap fase harus diverifikasi melalui unit testing dan build check sebelum melangkah ke fase berikutnya.
