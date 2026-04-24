# Modular SIMRS: Tenant & Composition Strategy

Dokumen ini menjelaskan strategi arsitektur untuk menangani Multi-Tenancy (berbagai cabang RS) dan Komposisi Modul (bagaimana merakit aplikasi) di dalam ekosistem Modular SIMRS.

## 🏗️ 1. Routing & Module Composition Strategy

Untuk mencapai tingkat skalabilitas dan fleksibilitas tertinggi, kita menggunakan pola **Orchestrator-Factory**.

### ❌ Anti-Pattern (Jangan Dilakukan)
Mendefinisikan instansiasi router (`createRouter`) dan hierarki rute yang kaku di dalam package `features/presentation`. Ini membuat Shell App kehilangan kendali atas fitur apa saja yang dimuat.

### ✅ Best Practice (Pola Perakitan di Shell App)
*   **Package Presentation (`features/presentation`)**: Berfungsi sebagai pabrik (Factory). Hanya mengekspor *Route Records* (`RouteRecordRaw[]`) atau kumpulan halaman UI.
*   **Shell Apps (`apps/*`)**: Berfungsi sebagai perakit (Orchestrator). Tiap tim developer dapat memilih dan mencampurkan modul mana yang ingin diaktifkan di Shell App mereka.

**Contoh di Shell App (`apps/simrs/src/routes/index.ts`):**
```typescript
import { createRouter } from 'vue-router';
// 1. Import modul standar dari Core/Presentation
import { patientRoutes } from '@genrs/presentation/patient';
import { pharmacyRoutes } from '@genrs/presentation/pharmacy';

// 2. Import modul kustom khusus tenant ini (jika ada)
import { customAfdilaRoutes } from './_tenants/afdila/routes';

const router = createRouter({
  routes: [
    ...patientRoutes,
    ...pharmacyRoutes,
    ...customAfdilaRoutes // Modul kustom ikut dirakit
  ]
});
```

---

## 🏢 2. Tenant Overrides Foldering (`_tenants`)

Untuk menangani kebutuhan bisnis yang spesifik per Rumah Sakit (Tenant) tanpa mengotori *Core Logic*, kita menerapkan pola direktori `_tenants` di dalam Shell App atau Presentation.

### Struktur Direktori
```text
src/
 ├── routes/
 │    ├── core/                # Rute standar bawaan produk
 │    │    └── dashboard.ts
 │    └── _tenants/            # Area khusus kustomisasi RS
 │         ├── afdila/
 │         │    └── extra.ts   # Penambahan menu baru khusus RS Afdila
 │         └── rspku/
 │              └── override.ts # Penimpaan tampilan/alur khusus RS PKU
```

### Aturan Main (Rules of Engagement)
1.  **Strict Isolation**: Kode di dalam folder `_tenants/afdila` murni hanya berisi kebutuhan RS Afdila. Dilarang melakukan pengecekan `if (tenant === 'afdila')` di dalam folder `core/`.
2.  **Tree-Shaking via Vite**: Dengan menggunakan `tenantResolver` (Vite Plugin), saat mem-build aplikasi untuk tenant tertentu, kode tenant lain tidak akan dimasukkan ke dalam hasil *build* (bundle size tetap kecil).
3.  **Fallthrough Pattern**: Jika sebuah Shell App di-build untuk tenant yang tidak memiliki file *override* di folder `_tenants`, aplikasi akan secara otomatis menggunakan modul dari `core/`.

---

## ⚙️ 3. Environment Strategy (Hybrid Mode)

Ekosistem ini memadukan dua pendekatan environment untuk memaksimalkan *Tree-Shaking* sekaligus menjaga fleksibilitas CI/CD.

### A. Baked-In Environment (Khusus Tenant)
- **Konteks**: Identitas RS (Tenant Code).
- **Mekanisme**: Di-inject saat *Build Time* menggunakan `import.meta.env.VITE_TENANT`.
- **Tujuan**: Agar bundler (Vite/Rollup) mengetahui secara statis tenant mana yang sedang dibangun. Ini mengaktifkan fitur **Tree-Shaking / Dead-Code Elimination**, sehingga kode milik RS A tidak akan pernah masuk ke dalam file bundle *(.js)* milik RS B.

### B. Runtime Environment (Untuk Config Infrastruktur)
- **Konteks**: URL API, Port, Sentry DSN, dll.
- **Mekanisme**: Di-inject saat *Container* (Docker) berjalan. Tidak menggunakan `import.meta.env`, melainkan membaca dari objek global (contoh: `window.__APP_CONFIG__`) yang disuntikkan oleh server/nginx.
- **Tujuan**: **Build Once, Deploy Anywhere**. Image Docker yang sama (misal: `simrs-afdila:latest`) dapat di-deploy ke environment *Development*, *Staging*, dan *Production* hanya dengan mengubah Environment Variable di level Docker.

---

## 🛡️ 4. Product Update & Versioning Strategy (Client Refusal Handling)

Dalam model SaaS Multi-Tenant, sering terjadi kasus di mana **Produk Core di-update (V2), namun Klien A menolak update dan ingin tetap di versi lama (V1)**. Untuk mengatasi hal ini tanpa merusak *Core Product* dan menghindari mimpi buruk *Git Branching*, kita menerapkan dua strategi utama:

### A. Strategi "Versioned Archive" (Macro Level)
Digunakan jika update bersifat masif (satu modul utuh berubah).
1.  **Archiving**: Pindahkan kode modul V1 ke dalam folder `_archives/nama-modul/v1/`.
2.  **Core Update**: Terapkan kode V2 yang baru di folder `core/nama-modul/`.
3.  **Manifest Versioning**: Di dalam folder tenant yang menolak update (`_tenants/klien-a/manifest.ts`), atur versinya secara spesifik:
    ```typescript
    export const activeModules = [
      { name: 'pendaftaran', version: '1' }, // Stay di V1 (baca dari _archives)
      { name: 'kasir', version: 'latest' }   // Ikut update V2 (baca dari core)
    ];
    ```

### B. Strategi "Ejection" (Micro Level)
Digunakan jika klien hanya menolak update pada komponen atau file spesifik (misal: hanya menolak perubahan UI Dashboard).
1.  **Eject (Copy)**: **Sebelum** melakukan update pada `core/dashboard.vue`, copy file tersebut ke dalam folder tenant `_tenants/klien-a/dashboard.vue`.
2.  **Update**: Lakukan perombakan pada `core/dashboard.vue`.
3.  **Result**: Karena aturan resolusi adalah **Tenant Override > Core**, maka `klien-a` akan tetap menjalankan kode lama dari folder mereka sendiri, sementara klien lain akan otomatis mendapatkan fitur baru dari `core`.

---
**Status**: Disetujui & Siap Diimplementasikan.
**Target**: Memudahkan tim developer meracik aplikasi per RS secara independen (Micro-Frontend / Modular Monolith approach) dan fleksibilitas infrastruktur untuk tim DevOps.
