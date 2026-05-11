<script setup lang="ts">
interface Props {
  label?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col gap-1.5 px-3 py-4">
    <div v-if="label" class="mb-1 px-3">
      <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
        {{ label }}
      </span>
    </div>
    <div class="flex flex-col gap-1">
      <slot />
    </div>
  </div>
</template>
