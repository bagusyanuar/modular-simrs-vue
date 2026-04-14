<script setup lang="ts">
import { computed } from 'vue';
import { tableCellVariants } from './ntable.variants';

const props = defineProps<{ class?: string }>();
const cellClass = computed(() => tableCellVariants({ class: props.class }));
</script>

<template>
  <td :class="cellClass">
    <slot />
  </td>
</template>
