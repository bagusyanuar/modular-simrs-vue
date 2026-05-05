<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Component } from 'vue';
import { ChevronRight } from 'lucide-vue-next';

interface Props {
  title: string;
  icon?: Component;
  defaultOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  defaultOpen: false,
});

const isOpen = ref(props.defaultOpen);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const triggerClasses = computed(() => [
  'group flex w-full items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out',
  'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200',
]);
</script>

<template>
  <div class="flex flex-col gap-1">
    <button :class="triggerClasses" @click="toggle">
      <div class="flex items-center gap-3">
        <div
          v-if="icon"
          class="flex h-5 w-5 items-center justify-center transition-transform duration-200 group-hover:scale-110"
        >
          <component :is="icon" class="h-full w-full" :stroke-width="2" />
        </div>
        <span class="text-sm font-medium tracking-wide">
          {{ title }}
        </span>
      </div>

      <ChevronRight
        :class="[
          'h-4 w-4 transition-transform duration-200 text-slate-400',
          isOpen ? 'rotate-90' : '',
        ]"
      />
    </button>

    <div
      v-show="isOpen"
      class="relative ml-5 flex flex-col gap-1 border-l border-slate-200/60 pl-2 dark:border-slate-800/60"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add smooth transition for opening/closing if v-show is replaced with height transition */
</style>
