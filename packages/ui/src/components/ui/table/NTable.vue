<script setup lang="ts">
import { computed } from 'vue';
import { tableVariants } from './ntable.variants';

const props = defineProps<{ class?: string }>();
const tableClass = computed(() => tableVariants({ class: props.class }));
</script>

<template>
  <div class="relative w-full overflow-auto">
    <table :class="tableClass">
      <slot />
    </table>
  </div>
</template>
