<script setup lang="ts">
import { computed } from 'vue';
import { labelVariants } from './nlabel.variants';

interface Props {
  for?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const labelClass = computed(() => {
  return labelVariants({
    size: props.size,
  });
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <label
    v-bind="$attrs"
    :for="props.for"
    :class="labelClass"
    class="block text-gray-700"
  >
    <slot />
    <span v-if="props.required" class="text-red-500 ml-0.5" aria-hidden="true">*</span>
  </label>
</template>
