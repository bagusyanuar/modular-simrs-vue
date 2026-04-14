<script setup lang="ts">
import { inject, computed } from 'vue';
import { CollapsibleContent } from 'reka-ui';
import { sidebarMenuSubVariants } from './nsidebar.variants';

const sidebar = inject<any>('n-sidebar', {
  collapsed: { value: false },
});

const isCollapsed = computed(() => sidebar.collapsed.value);
</script>

<template>
  <CollapsibleContent
    class="overflow-hidden transition-all data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300"
  >
    <div :class="sidebarMenuSubVariants({ collapsed: isCollapsed })">
      <slot />
    </div>
  </CollapsibleContent>
</template>
