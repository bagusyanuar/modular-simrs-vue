<script setup lang="ts">
import { buttonVariants } from './nbutton.variants';
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'primary' | 'outline' | 'ghost';
}>();

const buttonClass = computed(() => {
  return buttonVariants({
    variant: props.variant,
  });
});
</script>
<template>
  <button :class="buttonClass">
    <slot />
  </button>
</template>
