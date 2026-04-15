<script setup lang="ts">
import {
  inject,
  computed,
  onMounted,
  watch,
  getCurrentInstance,
  onUnmounted,
} from 'vue';

import { Icon } from '@iconify/vue';
import { sidebarItemVariants } from './nsidebar.variants';

interface Props {
  icon?: string;
  active?: boolean;
  to?: string | object;
  href?: string;
}

const props = defineProps<Props>();

const sidebar = inject<any>('n-sidebar', {
  collapsed: { value: false },
});

const sub = inject<any>('n-sidebar-sub', null);

const instance = getCurrentInstance();
const itemId = computed(() => `item-${instance?.uid}`);

onMounted(() => {
  if (sub) sub.reportActive(itemId.value, props.active || false);
});

onUnmounted(() => {
  if (sub) sub.reportActive(itemId.value, false);
});

watch(
  () => props.active,
  (isActive) => {
    if (sub) sub.reportActive(itemId.value, isActive || false);
  }
);

const isCollapsed = computed(() => sidebar.collapsed.value);

const tag = computed(() => {
  if (props.to) return 'RouterLink';
  if (props.href) return 'a';
  return 'div';
});

const itemClass = computed(() =>
  sidebarItemVariants({
    active: props.active,
    collapsed: isCollapsed.value,
  })
);
</script>

<template>
  <component :is="tag" :to="to" :href="href" :class="itemClass" v-bind="$attrs">
    <Icon
      v-if="icon"
      :icon="icon"
      class="shrink-0"
      :style="{ fontSize: '1rem' }"
    />
    <span
      v-if="!isCollapsed"
      class="flex-1 font-normal text-sm tracking-tight truncate animate-in fade-in duration-300"
    >
      <slot />
    </span>
  </component>
</template>
