---
trigger: manual
---

# 📋 Workflow: Create Component

Mekanisme manual untuk pembuatan komponen UI atau Feature sesuai standar arsitektur GenRS.

### 🎯 Objective
Menghasilkan komponen dengan struktur 4-file standar: `.vue`, `.variants.ts`, `index.ts`, dan `.stories.ts`.

### 🛠️ Execution Steps

#### 1. Identifikasi Target
- **UI Component**: Atomic/Generic logic.
  - Lokasi: `packages/ui/src/components/ui/[lowercase-name]`
  - Penamaan: Prefix `N` (misal: `NButton.vue`)
- **Feature Component**: Spesifik untuk modul/fitur tertentu.
  - Lokasi: `features/presentation/src/simrs/base/[feature]/components`
  - Penamaan: PascalCase tanpa prefix (misal: `UnitForm.vue`)

#### 2. Struktur File (Wajib 4 File)
1. **Component Vue**: `<script setup lang="ts">`. Implementasikan `$attrs` dan slots.
2. **Variants TS**: Gunakan `class-variance-authority` (cva). Standar size: `sm`, `md`, `lg`.
3. **Index TS**: Barrel export komponen dan variants.
4. **Stories TS**: Definisi Storybook untuk preview mandiri.

#### 3. Standard & Styling
- Gunakan Tailwind v4 brand tokens (`brand`, `brand-hover`, dll).
- Pastikan icon scaling (menggunakan `@iconify/vue`) konsisten dengan size komponen.
- Gunakan `v-bind="$attrs"` pada elemen root/utama.
