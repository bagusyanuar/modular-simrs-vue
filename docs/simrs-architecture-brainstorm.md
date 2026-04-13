# SIMRS Architecture Brainstorm
> Tanggal: 2026-04-13 | Status: Finalized | Project: modular-simrs-vue

---

## 📁 Struktur Final Arsitektur

```
modular-simrs-vue/                  ← monorepo root (Turborepo + pnpm)
├── apps/
│   ├── auth/                       ← portal login & sso logic
│   └── simrs/                      ← main shell application
├── features/
│   ├── core/                       ← Domain Layer (Logic murni)
│   ├── infrastructure/             ← Data Layer (Api, Repository Impl)
│   └── presentation/               ← UI Layer (Vue, Components)
│       └── src/simrs/
│           ├── base/               ← BASE PRODUCT (Fitur standar)
│           ├── _tenants/           ← OVERRIDE & CUSTOM (Per Klien)
│           │   └── rspku/
│           │       ├── manifest.ts ← Kendali fitur & versi
│           │       └── unit/       ← Kustomisasi per fitur
│           └── _archives/          ← LEGACY VERSION (Snapshot fitur)
│               └── unit/v1.0.0/
├── packages/
│   ├── ui/                         ← shared UI library (Shadcn-vue + Tailwind v4)
│   └── auth/                       ← shared auth utilities (guards, storage)
└── scripts/                        ← AUTOMATION (Scaffolding tools)
```

---

## 🏗️ Clean Architecture Enforcement

| Layer | Lokasi | Tanggung Jawab |
|---|---|---|
| **Domain** | `features/core` | Model, Interface Repository, Usecase (Zero Framework Dep) |
| **Infra** | `features/infrastructure` | Axios instance, Impl Repository, Mappers, Providers |
| **Presentation**| `features/presentation` | Vue Components, Composables, Multi-tenant Routes |

**Dependency Rule:** `core` ← `infrastructure` ← `presentation` (Strict)

---

## 🏷️ Naming Convention & Directory Logic

- **`base`**: Produk standar. Semua perubahan di sini berlaku untuk semua tenant (kecuali di-override).
- **`_tenants/{code}`**: Lokasi khusus untuk kustomisasi klien. Tidak boleh ada tenant yang mengimport dari folder tenant lain.
- **`_archives/`**: Digunakan untuk "pembekuan" fitur. Memungkinkan satu tenant tetap di versi lama sementara `base` terus berkembang.

---

## 🎨 Strategi Multi-Tenant (Final)

### 1. Vite Tenant Resolver
Menggunakan alias `@page/` dan resolver otomatis yang mencari file di:
1. `_tenants/[tenant]/[path]` (Priority 🥇)
2. `base/[path]` (Fallback 🥈)

### 2. Override & Merging Strategy (Router)
Alih-alih "Replace All", kita menggunakan strategi **Merging** untuk Route:
- **`*.routes.ts`**: Skema rute standar (di-resolve oleh tenant provider).
- **`extra.routes.ts`**: Rute tambahan atau override rute yang sudah ada.
- **Priority**: Global Extra > Feature Extra > Base/Archive.

### 3. Manifest-Driven Configuration
Setiap tenant memiliki `manifest.ts` yang mengatur fitur apa saja yang aktif dan versinya:

```typescript
// features/presentation/src/simrs/_tenants/rspku/manifest.ts
export const activeModules = [
  { name: 'unit', version: '1.0.0' },   // Menggunakan snapshot arsip
  { name: 'staff', version: 'latest' }, // Menggunakan kode terbaru di base
];
```

---

## 🧩 Extension Points (Kustomisasi Tanpa Braking)

Sistem secara otomatis mendeteksi file `extra.routes.ts` di folder tenant. Tenant bisa:
- **Menambah Sub-rute**: Menambah halaman baru ke modul yang sudah ada.
- **Override Rute**: Mengganti komponen pada path yang sama.
- **Membuat Modul Eksklusif**: Modul yang hanya ada di tenant tersebut tanpa ada di `base`.

---

## 🚀 Scaffolding Automation (Efficiency)

Kita menggunakan scripts di folder `root/scripts` untuk menjaga konsistensi:
- `pnpm create:feature`: Membuat folder vertikal di 3 layer sekaligus.
- `pnpm create:tenant`: Onboarding client baru (Manifest clone + `.env` setup).
- `pnpm create:custom`: Membangun extension point (`extra.routes.ts`) untuk tenant.
- `pnpm create:archive`: Mengambil snapshot `base` ke folder legacy.

---

## 🔐 Aturan Main (Team Convention)

1. **SACRED BASE**: Jangan edit file di `base/` hanya untuk mengakomodasi 1 tenant. Gunakan `pnpm create:custom`.
2. **ZERO LEAK**: Satu folder tenant (`_tenants/rspku`) tidak boleh mengimport file dari tenant lain (`_tenants/rsbunda`).
3. **EXPLICT EXPORT**: Hindari Barrel Export (`index.ts`) besar-besaran di root layer. Gunakan pemanggilan spesifik untuk performa tree-shaking maksimal.
4. **NO PLACEHOLDER**: Gunakan `generate_image` untuk asset dummy agar UI selalu terlihat premium sejak tahap dev.

---

## ✅ Progress Summary (April 2026)

- [x] Multi-tenant Routing (Vite Plugin + `@page` Alias).
- [x] Extension Point System (`extra.routes.ts`).
- [x] Centralized Auth & SSO Gateway.
- [x] Scaffolding Scripts (Feature, Tenant, Custom, Archive).
- [x] Standarisasi Clean Arch (Core, Infrastructure, Presentation).
- [x] Deployment Strategy (Turbo build per tenant via `--mode`).

---

## 🌙 Catatan Akhir Sesi
Arsitektur ini didesain agar SIMRS bisa diskalakan ke ratusan RS dengan variasi fitur yang sangat tinggi namun tetap memiliki satu **Core Engine** yang stabil dan mudah dikelola (Maintainable).

