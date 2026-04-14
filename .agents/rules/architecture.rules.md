---
trigger: auto
match: ["features/**/*", "apps/**/*", "packages/**/*"]
---

### 🎯 Principles & Stack
- **Principles**: DRY, Type Safe (Zero `any`), Perf (Dynamic imports), Secure.
- **Stack**: Vue 3.5.30 (Composition API) + Vite, TS, Tailwind v4.

### 🏗️ Tenanted Architecture
- **Structure**: `base/` vs `_tenants/<tenant>/` (Inside `features/presentation/src/<module>/`).
- **Layers**:
  - **Core** (`features/core`): Business logic, domain models, interfaces.
  - **Infrastructure** (`features/infrastructure`): Repositories, mappers, schemas.
  - **Presentation** (`features/presentation`): UI components, views, routes.
- **Rules**:
  - **Aliases**: Use `@page/*` (tenant-aware), `@genrs/core/*`, `@genrs/infrastructure/*`.
  - **Strict DRY**: Generic logic stays in `base/`.
  - **Zero Leak**: One tenant cannot import from another.
  - **Barrel**: Mandatory `index.ts` exports for every module.
  - **Tenant Resolver**: Files in `_tenants/` automatically override `base/` via Vite plugin.
