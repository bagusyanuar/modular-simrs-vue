# SIMRS Architecture Brainstorm
> Tanggal: 2026-04-09 | Project: modular-simrs-vue

---

## 📁 Struktur Saat Ini

```
modular-simrs-vue/                  ← monorepo root (Turborepo + pnpm)
├── apps/
│   ├── auth/
│   ├── finance/
│   └── simrs/                      ← shell app SIMRS
│       └── src/
│           ├── routes/
│           │   └── modules/unit.routes.ts
│           └── vite.config.ts
├── features/
│   ├── core/                       ← Domain Layer
│   │   └── src/simrs/base/
│   │       ├── domains/
│   │       │   ├── models/unit.model.ts
│   │       │   └── inputs/unit.input.ts
│   │       ├── repositories/unit.repository.ts   ← interface
│   │       └── usecases/unit.usecases.ts
│   ├── infrastructure/             ← Data Layer
│   │   └── src/simrs/base/
│   │       ├── repositories/unit.repository.ts   ← ApiUnitRepository
│   │       ├── schemas/unit.schema.ts
│   │       ├── mappers/
│   │       ├── keys/
│   │       └── providers/unit.provider.ts        ← DI wiring
│   └── presentation/               ← UI Layer
│       └── src/simrs/
│           └── base/               ← BASE PRODUCT PACKAGE
│               ├── components/
│               ├── composables/
│               └── pages/
│                   ├── staff/Staff.vue
│                   └── unit/Unit.vue
└── packages/
    └── ui/                         ← shared design system
```

---

## 🏗️ Clean Architecture Assessment

| Layer | Lokasi | Status |
|---|---|---|
| **Domain** | `features/core` | ✅ Murni, no framework dependency |
| **Repository Interface** | `features/core/.../repositories` | ✅ Interface di core |
| **Repository Impl** | `features/infrastructure/.../repositories` | ✅ `ApiUnitRepository implements UnitRepository` |
| **Use Cases** | `features/core/.../usecases` | ✅ Per class (`GetUnits`, `CreateUnit`, dll) |
| **DI Provider** | `features/infrastructure/.../providers` | ✅ Wire dependency manual |
| **UI Pages** | `features/presentation` | ⚠️ Composables masih kosong |

**Dependency Rule:** `core` ← `infrastructure` ← `presentation` ✅

---

## 🏷️ Naming Convention

- **`base`** = **Base product package** — fitur standar yang semua klien dapat
- Bukan "base" sebagai generic name, tapi sebagai product tier
- Future: bisa ada `premium/`, `enterprise/`, atau modul tambahan (`rawat-jalan/`, `rawat-inap/`, dll)

```
simrs/
└── base/        → Paket dasar (semua klien dapat)
```

---

## 🎨 Multi-Tenant Custom UI Strategy

### Konsep
Klien (RS) bisa request custom tampilan tanpa mengubah core logic.

### Struktur yang Direncanakan (Model B — Vite Virtual Module)

```
features/presentation/src/simrs/
├── base/                           ← default, selalu ada
│   └── pages/unit/Unit.vue
└── _tenants/                       ← override per klien (BELUM ADA, perlu dibuat)
    ├── rspku/
    │   └── pages/unit/Unit.vue     ← custom RS PKU
    └── rsbunda/
        └── pages/staff/Staff.vue   ← custom RS Bunda
```

### Tenant Resolver Plugin

```ts
// features/presentation/vite-plugin-tenant.ts
import { existsSync } from 'fs'
import path from 'path'

export function tenantResolver(tenantCode: string) {
  return {
    name: 'tenant-resolver',
    resolveId(id: string) {
      if (id.startsWith('@page/')) {
        const page = id.replace('@page/', '')
        const base = path.resolve(__dirname, 'src/simrs')
        const tenantFile = `${base}/_tenants/${tenantCode}/${page}.vue`
        const baseFile = `${base}/base/${page}.vue`
        return existsSync(tenantFile) ? tenantFile : baseFile
      }
    }
  }
}
```

### Dipakai di `apps/simrs/vite.config.ts`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { tenantResolver } from '../../features/presentation/vite-plugin-tenant'

const tenant = process.env.VITE_TENANT ?? 'base'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    tenantResolver(tenant),   // ← tenant-aware resolver
  ],
})
```

### Router — Bersih, Tidak Tahu Soal Tenant

```ts
// apps/simrs/src/routes/modules/unit.routes.ts
export const unitRoutes: RouteRecordRaw[] = [
  {
    path: '/unit',
    children: [
      {
        path: '',
        component: () => import('@page/pages/unit/Unit'),  // resolver handles it
      },
    ],
  },
]
```

### Build per Tenant

```bash
# .env files di apps/simrs/
.env.base    → VITE_TENANT=base
.env.rspku   → VITE_TENANT=rspku
.env.rsbunda → VITE_TENANT=rsbunda

# Build commands
pnpm --filter simrs build --mode rspku
pnpm --filter simrs build --mode base
```

---

## 🚀 Deploy Strategy

### Rekomendasi: Per-Tenant Build

| | Per-Tenant Build ✅ | Runtime Resolution ❌ |
|---|---|---|
| **Keamanan** | Kode tenant A tidak bocor ke B | Semua kode dalam 1 bundle |
| **Bundle size** | Kecil, hanya kode yang dipakai | Besar |
| **SIMRS context** | Per RS punya server/subdomain sendiri | — |
| **Turbo cache** | ✅ Build hanya yang berubah | — |

### Flow CI/CD

```
Git Push
   ├── [base change]    → rebuild semua tenant
   └── [rspku change]   → rebuild rspku saja (Turbo cache)
```

### Deploy target

```
simrs.rspku.com   → build VITE_TENANT=rspku
simrs.rsbunda.com → build VITE_TENANT=rsbunda
simrs.demo.com    → build VITE_TENANT=base
```

---

## 🔮 Decision Tree — Kapan Buat Shell App Baru?

```
Client minta custom?
       │
       ├── Hanya UI/tampilan?
       │      → Tambah folder di _tenants/{code}/
       │      → Beda env file saja ✅ CUKUP
       │
       └── Routing beda / modul tambahan / layout beda?
              → Buat shell app baru di apps/simrs-{code}/ ✅
```

---

## 🔒 Aturan Custom Tenant — Business Logic & Infrastructure

### Prinsip Utama: `base/` adalah Read-Only

```
features/
├── core/src/simrs/
│   ├── base/            ← SACRED — hanya diubah jika berlaku SEMUA tenant
│   └── _tenants/
│       └── rspku/       ← semua custom rspku di sini
│
├── infrastructure/src/simrs/
│   ├── base/            ← SACRED
│   └── _tenants/
│       └── rspku/
│
└── presentation/src/simrs/
    ├── base/            ← SACRED
    └── _tenants/
        └── rspku/
```

**Pola ini berlaku konsisten di semua layer — bukan hanya presentation.**

### Kapan Gunakan `_tenants/` per Layer?

| Kebutuhan Custom | Layer yang di-override |
|---|---|
| Tampilan/UI berbeda | `presentation/_tenants/{code}/` |
| API endpoint berbeda | `infrastructure/_tenants/{code}/repositories/` |
| Business rule berbeda | `core/_tenants/{code}/usecases/` |
| Semua di atas | Semua layer, tetap di `_tenants/{code}/` |

### Team Convention Rules

```
❌ JANGAN  → edit file di dalam base/ untuk keperluan 1 tenant
✅ SELALU  → buat override di _tenants/{code}/ jika ada custom
✅ SELALU  → base/ hanya diubah jika perubahan berlaku SEMUA tenant
✅ HAPUS   → cukup hapus _tenants/{code}/ jika tenant off-board
```

### Keuntungan Konsistensi Ini

| Skenario | Tanpa `_tenants` | Dengan `_tenants` |
|---|---|---|
| Update base product | ⚠️ Takut breaking tenant | ✅ Aman, base bersih |
| Onboarding developer baru | ⚠️ Bingung mana base mana tenant | ✅ Jelas pemisahannya |
| Bug di tenant A | ⚠️ Bisa merembet ke tenant B | ✅ Terisolasi per folder |
| Audit / code review | ⚠️ Susah trace perubahan | ✅ `git diff _tenants/rspku/` langsung keliatan |
| Off-board tenant | ⚠️ Harus hunting code tersebar | ✅ Hapus 1 folder selesai |

### Kapan Custom Menjadi "Produk Baru"?

> Jika lebih dari **~30% logic** berbeda dengan base → itu bukan custom lagi, itu **produk baru**. Pertimbangkan membuat modul/domain terpisah.

---

## ✅ TODO Implementasi

- [ ] Buat `vite-plugin-tenant.ts` di `features/presentation/`
- [ ] Buat folder `_tenants/` di `features/presentation/src/simrs/`
- [ ] Update `apps/simrs/vite.config.ts` — pasang plugin + baca `VITE_TENANT`
- [ ] Update router pakai `@page/` alias bukan hardcoded path
- [ ] Buat `.env.base` dan `.env.{tenantCode}` di `apps/simrs/`
- [ ] Isi composables di `presentation/simrs/base/composables/` — jembatan use case ↔ Vue
