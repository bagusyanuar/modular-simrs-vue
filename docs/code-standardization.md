# Code Standardization: Modular SIMRS

Dokumen ini mendefinisikan standar koding dan arsitektur untuk pengembangan SIMRS Modular dalam lingkungan monorepo. Semua developer wajib mengikuti standar ini untuk menjaga konsistensi, keamanan tipe, dan performa aplikasi.

---

## 1. Naming Conventions

Pemberian nama harus deskriptif dan konsisten mengikuti pola berikut:

### **Filenames & Folders**
- **Vue Components**: `UpperCamelCase.vue` (contoh: `FormInput.vue`, `UnitList.vue`).
- **Logic & Services**: `kebab-case.ts` (contoh: `auth-service.ts`, `api-client.ts`).
- **Suffix-based Naming**: Menggunakan suffix untuk memperjelas identitas layer:
  - `*.repository.ts`: Logika integrasi data (Infrastructure).
  - `*.usecases.ts`: Logika bisnis/domain (Core).
  - `*.routes.ts`: Definisi rute utama modul.
  - `*.extra.ts`: Definisi rute tambahan (non-generic/tenant-specific).
- **Tenant Folders**: Selalu diawali dengan underscore: `_tenants/{tenant-code}/`.

### **Variable & Code Styling**
- **Types/Interfaces**: `PascalCase` dengan deskripsi jelas (contoh: `UnitParams`, `AuthResponse`).
- **Global Constants**: `SCREAMING_SNAKE_CASE` (khusus untuk yang di-inject Vite: `__APP_VERSION__`, `__TENANT_CODE__`).
- **Boolean Variables**: Diawali dengan is/has/should (contoh: `isLoading`, `hasPermission`).

---

## 2. Folder Structure (Tenanted Monorepo)

Struktur folder mengikuti pola **Shared Base + Tenant Overrides** untuk skalabilitas maksimal.

```bash
├── apps/                  # Shell Applications (Next.js/Vite)
│   └── simrs/             # Client Shell Utama
├── features/              # Modular Features (Pola DDD)
│   ├── core/              # Layer 1: Business Logic & Domain Models
│   ├── infrastructure/    # Layer 2: Data Repositories & API Mappers
│   └── presentation/      # Layer 3: Vue Components & Multi-Tenant UI
│       └── src/simrs/
│           ├── base/      # Generic Product (Read-Only untuk Custom)
│           └── _tenants/  # Overrides & Extension per Client
└── packages/              # Shared Utilities & UI Library (Design System)
```

---

## 3. Separation of Concerns (Layered Architecture)

Kita membagi tanggung jawab kode ke dalam 3 layer utama untuk memastikan kode mudah di-test dan tidak saling ketergantungan secara acak.

| Layer | Lokasi | Tanggung Jawab | Aturan Ketat |
| :--- | :--- | :--- | :--- |
| **Core** | `features/core` | Domain model, Interfaces, & Business Use-cases. | **Zero Dependency**: Tidak boleh meng-import dari Infra atau Presentation. |
| **Infrastructure** | `features/infrastructure` | Implementasi Repository, Axios calls, Web Storage, & Data Mappers. | Mengimplementasikan Interface yang didefinisikan di Core. |
| **Presentation** | `features/presentation` | Vue Components, Composables, UI Logic, & Tenant Routes. | **Consumer**: Menggunakan Usecase dari Core untuk memproses data. |

---

## 4. Reusability Principles

Prinsip utama kita adalah **DRY (Don't Repeat Yourself)** di level Base, namun **Safe-Overriding** di level Tenant.

### **Base vs Extension**
- **Sacret Base**: Folder `base/` berisi logika yang 80-90% sama di semua RS. Jika ada perubahan yang bersifat umum, perbaiki di sini.
- **Extension Points (`.extra.ts`)**: Jangan memodifikasi routing produk hanya untuk menambah tombol khusus di satu RS. Gunakan `.extra.ts` di folder tenant untuk "menyuntikkan" fitur tambahan.

### **Tree-Shaking by Manifest**
Efisiensi build ditentukan oleh `manifest.ts`. Gunakan manifest untuk memilih modul mana yang benar-benar aktif. Modul yang tidak terdaftar tidak akan di-bundle ke dalam aplikasi tenant tersebut.

### **Component Reusability**
- Gunakan `@genrs/ui` (Shadcn-vue) untuk komponen UI dasar.
- Buat folder `components/` di level feature hanya jika komponen tersebut bersifat domain-specific (contoh: `UnitSelector.vue`).

---

## 5. Component Strategy

### Approach
- **Custom-Built Components**: Mengutamakan pembuatan komponen secara manual/custom untuk mendapatkan kontrol penuh atas markup dan styling.
- **AI-Powered Development**: Mengoptimalkan penggunaan AI (seperti Antigravity) untuk mempercepat scaffolding dan logika komponen tanpa harus bergantung pada library eksternal yang berat.

### Decision: Tidak menggunakan Shadcn/UI
- **Alasan Overhead**: Library seperti Shadcn memerlukan proses *restyling* ulang yang masif agar sesuai dengan brand identity SIMRS, yang justru menambah beban kerja (overhead).
- **Efisiensi Design System**: Lebih efisien membangun dari nol menggunakan Tailwind v4 yang disesuaikan langsung dengan token design system kita.
- **Bundle Size**: Menjaga bundle size tetap minimal dengan hanya menyertakan kode yang benar-benar digunakan.

---

## 6. Deployment & Versioning Standards

- **Hybrid Versioning**: Versi aplikasi adalah gabungan dari `Base Semver` + `Tenant Revision`.
  - Format: `v[Major.Minor.Patch]+[TenantCode].rev-[GitCount]`
- **Safeguard**: Setiap tenant wajib mencantumkan `schemaVersion` di manifest. Jika engine di-upgrade ke struktur baru, build tenant lama akan otomatis error untuk mencegah crash di produksi.
