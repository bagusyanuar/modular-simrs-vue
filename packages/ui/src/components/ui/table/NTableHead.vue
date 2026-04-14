<script setup lang="ts">
import { computed } from 'vue';
import { tableHeaderVariants } from './ntable.variants';

const props = defineProps<{ class?: string }>();
const headClass = computed(() => tableHeaderVariants({ class: props.class }));
</script>

<template>
  <th :class="headClass">
    <slot />
  </th>
</template>
