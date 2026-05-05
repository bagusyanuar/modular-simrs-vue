<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

interface Props {
  icon?: Component;
  title: string;
  active?: boolean;
  to?: string;
  badge?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  active: false,
  to: undefined,
  badge: undefined
});


const itemClasses = computed(() => {
  return [
    'group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out',
    props.active
      ? 'bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-sm'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
  ];
});
</script>

<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    :class="itemClasses"
  >
    <div class="flex items-center gap-3">
      <div v-if="icon" class="flex h-5 w-5 items-center justify-center transition-transform duration-200 group-hover:scale-110">
        <component :is="icon" class="h-full w-full" :stroke-width="active ? 2.5 : 2" />
      </div>
      <span class="text-sm tracking-wide">
        {{ title }}
      </span>
    </div>
    
    <div v-if="badge" class="flex items-center justify-center">
      <span class="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm ring-1 ring-white/20">
        {{ badge }}
      </span>
    </div>
  </component>
</template>
