---
trigger: auto
match: ["packages/ui/**/*", "features/presentation/**/*"]
---

### 🎨 Component Rules

#### 🏷️ Naming Convention
- **UI Components** (`packages/ui`): Prefix `N` (e.g., `NButton.vue`).
- **Feature Components** (`features/`): PascalCase tanpa prefix (e.g., `UnitList.vue`).

#### 🏗️ UI Component Structure (Mandatory 4 Files)
1. `N{Name}.vue`: Template & logic utama.
2. `n{name}.variants.ts`: Definisi style menggunakan `cva` (Class Variance Authority).
3. `index.ts`: Barrel export.
4. `N{Name}.stories.ts`: Definisi Storybook.

#### 🛠️ Implementation Standards
- **Sizing**: Gunakan standar `sm`, `md`, `lg`.
- **Icons**: Gunakan `@iconify/vue` untuk icon. Implementasikan scaling otomatis untuk icon di dalam slot prefix/suffix.
- **Attributes**: Selalu gunakan `v-bind="$attrs"` pada elemen target (biasanya input/button).
- **Styling**: Wajib menggunakan Tailwind v4 brand tokens (`bg-brand`, `text-brand-foreground`, dll).
- **Vue**: Gunakan `script setup lang="ts"`, `defineProps`, dan `defineEmits`.
