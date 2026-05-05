<script setup lang="ts">
const logo = '/v2/logo.png';

interface Props {
  title?: string;
  subtitle?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex items-center gap-3 px-4 py-6">
    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 p-2 ring-1 ring-primary/20 transition-all hover:scale-105 active:scale-95">
      <img :src="logo" alt="Logo" class="h-full w-full object-contain" />
    </div>
    <div class="flex flex-col overflow-hidden transition-all">
      <span class="truncate font-bold tracking-tight text-slate-900 dark:text-white">
        {{ title || 'Neurovi' }}
      </span>
      <span class="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
        {{ subtitle || 'Inventory System' }}
      </span>
    </div>
  </div>
</template>
