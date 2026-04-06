import type { Ref } from "vue"
import { createContext } from "reka-ui"

export { default as NCommand } from "./NCommand.vue"
export { default as NCommandDialog } from "./NCommandDialog.vue"
export { default as NCommandEmpty } from "./NCommandEmpty.vue"
export { default as NCommandGroup } from "./NCommandGroup.vue"
export { default as NCommandInput } from "./NCommandInput.vue"
export { default as NCommandItem } from "./NCommandItem.vue"
export { default as NCommandList } from "./NCommandList.vue"
export { default as NCommandSeparator } from "./NCommandSeparator.vue"
export { default as NCommandShortcut } from "./NCommandShortcut.vue"

export const [useCommand, provideCommandContext] = createContext<{
  allItems: Ref<Map<string, string>>
  allGroups: Ref<Map<string, Set<string>>>
  filterState: {
    search: string
    filtered: { count: number, items: Map<string, number>, groups: Set<string> }
  }
}>("Command")

export const [useCommandGroup, provideCommandGroupContext] = createContext<{
  id?: string
}>("CommandGroup")
