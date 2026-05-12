# Code Standardization: Neurovi V2

Dokumen ini mendefinisikan standar koding dan arsitektur untuk pengembangan Neurovi V2 dalam lingkungan monorepo. Semua developer wajib mengikuti standar ini untuk menjaga konsistensi, keamanan tipe, dan performa aplikasi.

---

## 1. Naming Conventions

Pemberian nama harus deskriptif dan konsisten mengikuti pola berikut:

### **Filenames & Folders**

- **Vue Components**: `UpperCamelCase.vue` (contoh: `FormInput.vue`, `UnitList.vue`).
- **Logic & Services**: `kebab-case.ts` (contoh: `auth-service.ts`, `api-client.ts`).
- **Suffix-based Naming**: Menggunakan suffix untuk memperjelas identitas layer:
  - `*.usecase.ts`: Logika bisnis/domain (Core).
  - `*.model.ts` & `*.input.ts`: Domain models dan input types (Core).
  - `*.repository.ts`: Interface (Core) atau Implementasi (Infrastructure).
  - `*.mapper.ts` & `*.provider.ts`: Transformasi data dan external providers (Infrastructure).
  - `*.schema.ts` & `*.validator.ts`: Validasi data dan schema zod (Infrastructure).
  - `*.routes.ts`: Definisi rute per module (Shell Apps -> `src/router/`).
  - `*.middleware.ts`: Logika navigation guard (Shell Apps -> `src/middleware/`).
- **Tenant Folders**: Selalu diawali dengan underscore: `_tenants/{tenant-code}/`.

### **Variable & Code Styling**

- **Types/Interfaces**: `PascalCase` (contoh: `interface UnitForm {}`).
- **Constants**: `SCREAMING_SNAKE_CASE` (contoh: `const UNIT_OPTIONS`).
- **Variables**: `camelCase` (contoh: `let unitData`).
- **Boolean Variables**: `camelCase` dengan prefix **is** / **has** (contoh: `isLoading`, `hasDiagnose`).
- **Functions**: `camelCase` (contoh: `function fetchData() {}` atau `const handleLogin = () => {}`).

---

## 2. Folder Structure (Tenanted Monorepo)

Struktur folder mengikuti pola **Shared Base + Tenant Overrides** untuk skalabilitas maksimal.

```bash
├── apps/                  # Shell Applications (Vue 3 + Vite)
│   └── simrs/             # Client Shell Utama
│       └── src/
│           ├── router/    # Routing Orchestration (index.ts + *.routes.ts)
│           └── middleware/ # Navigation Guards (Auth, RBAC, etc)
├── modules/               # Domain Modules (Clean Architecture)
│   ├── core/              # Layer 1: Business Logic, Models & Interfaces
│   ├── infrastructure/    # Layer 2: Repositories Implementation & Mappers
│   └── presentation/      # Layer 3: UI Components, Composables & Pages
│       └── src/
│           ├── base/      # Generic Product (Read-Only untuk Custom)
│           └── _tenants/  # Overrides & Extension per Client
└── packages/              # Shared Utilities & UI Library (Design System)
```

---

## 3. Separation of Concerns (Layered Architecture)

Kita membagi tanggung jawab kode ke dalam 3 layer utama untuk memastikan kode mudah di-test dan tidak saling ketergantungan secara acak.

| Layer              | Lokasi                   | Tanggung Jawab                                                     | Aturan Ketat                                                               |
| :----------------- | :----------------------- | :----------------------------------------------------------------- | :------------------------------------------------------------------------- |
| **Core**           | `modules/core`           | Domain model, Interfaces, & Business Use-cases.                    | **Zero Dependency**: Tidak boleh meng-import dari Infra atau Presentation. |
| **Infrastructure** | `modules/infrastructure` | Implementasi Repository, Axios calls, Web Storage, & Data Mappers. | Mengimplementasikan Interface yang didefinisikan di Core.                  |
| **Presentation**   | `modules/presentation`   | Vue Components, Composables, UI Logic                              | **Consumer**: Menggunakan Usecase dari Core untuk memproses data.          |

---

---

## 4. Development Flow

### Form & Validation

- **vee-validate**: Digunakan untuk form state management dan binding UI.
- **zod**: Sebagai single source of truth untuk schema validation.

**Pattern:**

- **Schema-driven form**: Definisi validasi dipusatkan dalam satu schema zod.
- **Centralized validation**: Menghindari penulisan rules yang tersebar di template, sehingga logic validasi mudah di-reuse dan di-test.

---

### Data Fetching

- **@tanstack/query**
  - Menangani caching, request deduplication, dan server-state management.
  - Memastikan data sinkron di seluruh komponen tanpa perlu prop-drilling yang dalam.

- **axios**
  - Sebagai transport layer (HTTP client).
  - Centralized config: Interceptor untuk token auth, logging, dan global error handling berada di sini.

**Separation of Concerns:**

- **Axios**: Bertanggung jawab atas "bagaimana data dikirim" (transport layer).
- **Tanstack Query**: Bertanggung jawab atas "bagaimana data dikelola di UI" (orchestration & state layer).

---

## 5. Reusability Principles

Prinsip utama kita adalah **DRY (Don't Repeat Yourself)** di level Base, namun **Safe-Overriding** di level Tenant.

### **Base vs Extension**

- **Sacret Base**: Folder `base/` berisi logika yang 80-90% sama di semua RS. Jika ada perubahan yang bersifat umum, perbaiki di sini.

---

## 6. Deployment & Versioning Standards

- **Hybrid Versioning**: Versi aplikasi adalah gabungan dari `Base Semver` + `Tenant Revision`.
  - Format: `v[Major.Minor.Patch]+[TenantCode].rev-[GitCount]`

---

## 7. Key Principles

- **Consistency over Preference**: Kita lebih mengutamakan konsistensi pola di seluruh project daripada preferensi gaya koding pribadi.
- **Centralized Logic**: Logika krusial seperti Schema Validation, Fetching mechanism, dan Global Config harus dipusatkan di satu tempat (`core` atau `packages`) untuk kemudahan maintenance.
- **Separation of Concerns**: Pemisahan yang tegas antara **UI (Presentation)**, **Logic (Core)**, dan **Data (Infrastructure)**. Tidak boleh ada logika API di dalam file `.vue`.
