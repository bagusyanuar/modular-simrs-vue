<script setup lang="ts">
import { provide, computed } from 'vue';
import { sidebarVariants } from './nsidebar.variants';

interface Props {
  class?: string;
}

const collapsed = defineModel<boolean>('collapsed', { default: false });

provide('n-sidebar', {
  collapsed,
  toggle: () => (collapsed.value = !collapsed.value),
});

const props = defineProps<Props>();

const shellClass = computed(() =>
  sidebarVariants({
    collapsed: collapsed.value,
    class: props.class,
  })
);
</script>

<template>
  <aside :class="shellClass">
    <div
      class="h-full w-full bg-white rounded-lg shadow-2xl flex flex-col border border-gray-50"
    >
      <slot />
    </div>
  </aside>
</template>
