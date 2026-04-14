<script setup lang="ts">
import { inject, computed } from 'vue';
import { sidebarGroupVariants } from './nsidebar.variants';

interface Props {
  label?: string;
}

const props = defineProps<Props>();

const sidebar = inject<any>('n-sidebar', {
  collapsed: { value: false },
});

const isCollapsed = computed(() => sidebar.collapsed.value);

const groupClass = computed(() =>
  sidebarGroupVariants({ collapsed: isCollapsed.value })
);
</script>

<template>
  <div :class="groupClass">
    <div v-if="label">
      <div
        v-if="!isCollapsed"
        class="px-2 pt-5 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest animate-in fade-in duration-500"
      >
        {{ label }}
      </div>
      <div v-else class="w-7 h-px bg-gray-100 my-4 mx-auto" />
    </div>
    <div class="flex flex-col gap-0.5 w-full">
      <slot />
    </div>
  </div>
</template>
