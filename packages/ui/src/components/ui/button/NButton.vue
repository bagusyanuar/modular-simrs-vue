<script setup lang="ts">
import { buttonVariants } from './nbutton.variants';
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
}>();

const buttonClass = computed(() => {
  return buttonVariants({
    variant: props.variant,
    size: props.size,
  });
});
</script>
<template>
  <button
    :class="buttonClass"
    v-bind="$attrs"
    :disabled="props.disabled || props.loading"
  >
    <svg
      v-if="props.loading"
      class="animate-spin h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75 bg-accent-700"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot v-if="props.size !== 'icon' || !props.loading" />
  </button>
</template>
