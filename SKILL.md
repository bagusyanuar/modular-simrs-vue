# ⚡ GenRS Agent Skills

### 🛠️ Scaffolding

- **Create Feature**: `pnpm create:feature <feature> <module>` (e.g., `unit simrs`).
- **New Tenant**: `pnpm create:tenant <name>` (e.g., `rspku`).
- **Tenant Custom**: `pnpm create:custom <tenant> <feature>` (e.g., `rspku unit`).
- **Archive**: `pnpm create:archive <module> <feature> <version>`.
- **Cleanup**: `pnpm create:cleanup <module> <feature> <version>`.

### 🎨 UI Components (4-File Pattern)

1. **N{Name}.vue**: Logic & Template. `defineProps`, `v-bind="$attrs"`.
2. **n{name}.variants.ts**: Styling via `cva` + Tailwind v4.
3. **index.ts**: Barrel export.
4. **N{Name}.stories.ts**: Storybook specs.

### 🔄 Tenanted Overrides

- **Routes**: Tambahkan di `_tenants/<tenant>/[feature]/extra.routes.ts`.
- **Logic/Repo**: Override di folder `_tenants/` pada layer Core/Infrastructure.
- **Manifest**: Update `activeModules` di `_tenants/<tenant>/manifest.ts` untuk versi arsip.
