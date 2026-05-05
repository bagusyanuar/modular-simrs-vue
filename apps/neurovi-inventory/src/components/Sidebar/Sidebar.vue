<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  width?: string;
  collapsible?: boolean;
}

withDefaults(defineProps<Props>(), {
  width: 'w-72',
  collapsible: false
});

const isCollapsed = ref(false);
</script>

<template>
  <aside 
    :class="[
      'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-20' : width,
      'border-r border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80'
    ]"
  >
    <div class="flex h-full flex-col">
      <!-- Header -->
      <slot name="header" />

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="border-t border-slate-200/60 p-4 dark:border-slate-800/60">
        <slot name="footer" />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  border-radius: 10px;
}
</style>
