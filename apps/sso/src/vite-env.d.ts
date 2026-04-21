/// <reference types="vite/client" />
/// <reference types="@genrs/presentation/types" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
