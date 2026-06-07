# 📏 UI Component Slicing Rules

Aturan teknis untuk slicing komponen di `packages/ui`.

### 🏗️ File Structure
- Wajib 4 file: `[Name].vue`, `[name].variants.ts`, `index.ts`, `[Name].stories.ts`.
- Prefix `N` untuk semua komponen UI di `packages/ui` (e.g. `NButton`, `NInput`).

### 🎨 Styling Standard
- Framework: Tailwind CSS v4.
- Library: `class-variance-authority` (cva).
- Tokens: Wajib menggunakan brand tokens (primary, secondary, accent) yang didefinisikan di CSS variables.
- Utilities: Gunakan `tailwind-merge` dan `clsx` untuk penggabungan class.

### 🧩 Logic Standard
- Vue version: 3.5+.
- Props: Gunakan `defineProps<Props>()` dengan interface eksplisit.
- Defaults: Wajib memberikan default value via `withDefaults`.
- Attributes: Elemen utama wajib memiliki `v-bind="$attrs"`.
- Events: Gunakan `defineEmits` atau `defineModel`.

### 📚 Storybook Standard
- Setiap komponen wajib memiliki `.stories.ts`.
- Minimal mencakup story `Default`, `Variants`, dan `Sizes`.
