# AI Skill: SIMRS Development Standard

## 1. UI Component Mastery (G-Prefix)

- **Primary Rule**: Always use internal reusable components with prefix `G`.
- **Mapping**:
  - HTML `<button>` / Shadcn `Button` -> Use `<GButton>`
  - HTML `<input>` / Shadcn `Input` -> Use `<GTextField>`
  - HTML `<label>` -> Use `<GLabel>`
  - HTML `<table>` -> Use `<GDataTable>`
- **Source**: Components are located in `@genrs/ui/components`.
- **Pattern**: Most `G` components support `v-model` and have an `:error` prop for validation.

## 2. Converting Shadcn Components to Internal Wrappers (G-Components)

When adding a new Shadcn Vue component, it MUST be wrapped into a `G`-prefixed internal component. This guarantees isolation and standardizes the design language across all applications.

### Step-by-Step Flow:
1. **Generate**: Use the Shadcn CLI in `packages/ui` to fetch the raw component. It lands in `src/shadcn/components/ui/`.
2. **Create Wrapper Folder**: Create `packages/ui/src/components/{component}/`.
3. **Internal Import Rule (`#shadcn`)**: Inside your wrapper `G{Component}.vue`, you MUST import the raw Shadcn files using the internal `#shadcn` import map. Do NOT use relative or global aliases for Shadcn components.
   ```vue
   <script setup lang="ts">
   import { Button } from '#shadcn/components/ui/button';
   import { cn } from '#shadcn/lib/utils';
   </script>
   ```
4. **Forward Binding**: Pass Fallthrough Attributes into the UI component elegantly using `v-bind="$attrs"` so native HTML elements (like `type`, `id`, `placeholder`) still work transparently without boilerplate.
5. **Create Index Exporter**: Provide an `index.ts` file in the folder to expose it neatly (e.g. `export { default as GButton } from './GButton.vue';`).
6. **Create a Story**: Always supplement the new wrapper with a `.stories.ts` file in the same folder to document what props you have standardized.
