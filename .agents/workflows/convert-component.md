---
description: Convert Shadcn -> N[Name] (In-place)
---

### 🚀 N-Component Conversion (In-place)

1. **Rename**: `[Name].vue` -> `N[Name].vue` & `index.ts` -> `export { default as N[Name] } from './N[Name].vue';`.
2. **Story**: Buat `N[Name].stories.ts`.
3. **Style**:
   - Hapus `ring`.
   - Gunakan `primary` (Teal-500).
   - Pake `transition-all duration-200`.

> [!TIP]
> Gak usah folder baru, Bosku! Langsung rename di tempat biar irit.
