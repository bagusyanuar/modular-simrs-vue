<script setup lang="ts">
import { buttonVariants } from './nbutton.variants';
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
}>();

const buttonClass = computed(() => {
  return buttonVariants({
    variant: props.variant,
    size: props.size,
  });
});
</script>
<template>
  <button :class="buttonClass" v-bind="$attrs" :disabled="props.disabled">
    <slot />
  </button>
</template>
