<script setup lang="ts">
import { inject, computed } from 'vue';
import { CollapsibleTrigger } from 'reka-ui';
import { Icon } from '@iconify/vue';
import { sidebarItemVariants } from './nsidebar.variants';

interface Props {
  icon?: string;
}

defineProps<Props>();

const sidebar = inject<any>('n-sidebar', {
  collapsed: { value: false },
});

const isCollapsed = computed(() => sidebar.collapsed.value);
</script>

<template>
  <CollapsibleTrigger as-child>
    <div
      :class="[
        sidebarItemVariants({ collapsed: isCollapsed }),
        'group/trigger transition-colors',
      ]"
    >
      <Icon v-if="icon" :icon="icon" class="shrink-0" style="font-size: 1rem" />
      <span
        v-if="!isCollapsed"
        class="flex-1 font-normal text-sm tracking-tight truncate animate-in fade-in duration-300"
      >
        <slot />
      </span>
      <Icon
        v-if="!isCollapsed"
        icon="lucide:chevron-right"
        class="ml-auto text-gray-400 text-xs transition-transform duration-200 group-data-[state=open]/trigger:rotate-90"
      />
    </div>
  </CollapsibleTrigger>
</template>
