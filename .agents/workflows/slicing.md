---
trigger: manual
---

# 🔪 Workflow: Slicing Components

Prosedur memecah desain (Figma/Wireframe) menjadi komponen UI yang modular di `packages/ui`.

### 🎯 Objective
Transformasi desain menjadi atomic components yang reusable dengan standar GenRS.

### 🛠️ Execution Steps

#### 1. Identifikasi & Dekonstruksi
- Analisis UI: Pisahkan elemen menjadi Atomic (Button, Input) atau Molecule (FormGroup, Card).
- Cek duplikasi: Pastikan komponen belum ada di `packages/ui/src/components/ui/`.

#### 2. Setup Folder & File
- Buat folder di `packages/ui/src/components/ui/[name]`.
- Generate 4 file standar:
  - `N[Name].vue`: Template & Logic.
  - `n[name].variants.ts`: CVA styles & Tokens.
  - `index.ts`: Barrel export.
  - `N[Name].stories.ts`: Dokumentasi Storybook.

#### 3. Implementasi Logic (Vue 3.5+)
- Gunakan `defineModel()` untuk state reaktif (v-model).
- Gunakan `useId()` untuk accessibility ID.
- Implementasikan `v-bind="$attrs"` untuk attribute inheritance.
- Pastikan Type/Interface spesifik (NO `any`).

#### 4. Styling (Tailwind v4)
- Gunakan brand tokens: `brand`, `brand-hover`, `brand-active`.
- Gunakan `cva` untuk variasi state (disabled, error, active).
- Pastikan support Dark Mode jika diperlukan.

#### 5. Registrasi & Export
- Export dari `packages/ui/src/index.ts` untuk konsumsi global.
- Verifikasi visual di Storybook.
