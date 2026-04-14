<script setup lang="ts">
import { computed } from 'vue';
import { tableRowVariants } from './ntable.variants';

const props = defineProps<{
  class?: string;
  selected?: boolean;
}>();

const rowClass = computed(() =>
  tableRowVariants({
    class: props.class,
  })
);
</script>

<template>
  <tr :class="rowClass" :data-state="selected ? 'selected' : undefined">
    <slot />
  </tr>
</template>
