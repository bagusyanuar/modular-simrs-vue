<script setup lang="ts">
import { computed } from 'vue';
import { helperTextVariants } from './nhelpertext.variants';

interface Props {
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const classes = computed(() => {
  return helperTextVariants({
    state: props.error ? 'error' : 'default',
    size: props.size,
  });
});
</script>

<template>
  <p :class="classes">
    <slot />
  </p>
</template>
