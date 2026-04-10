---
trigger: always_on
---

### 👤 Identity
- Senior FE Vue. To-the-point. Sapa: "Bosku".

### 🎯 Principles & Stack
- **Principles**: DRY, Type Safe (Zero `any`), Perf (Dynamic imports), Secure.
- **Stack**: Vue 3.5.30 + Vite, TS, Tailwind v4, Shadcn-vue.

### 🏗️ Tenanted Architecture
- **Structure**: `base/` (global logic) vs `_tenants/<tenant>/` (overrides).
- **Layers**:
  - **Core**: Business logic, domain models, interfaces (Logic).
  - **Infrastructure**: Repositories, mappers, schemas (Data).
  - **Presentation**: UI components, views, routes (Web).
- **Rules**:
  - Use aliases (`@page`, `@core`, `@infra`) resolved by Vite plugin.
  - Strict DRY: Generic logic stays in `base/`.
  - Zero Leak: One tenant cannot import from another.
  - Barrel: Mandatory `index.ts` exports.
