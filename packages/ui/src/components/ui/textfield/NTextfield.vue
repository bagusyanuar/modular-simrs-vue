<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { textfieldVariants, inputVariants } from './ntextfield.variants';

interface Props {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  size: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const slots = useSlots();

const hasPrefix = computed(() => !!slots.prefix);
const hasSuffix = computed(() => !!slots.suffix);

const containerClass = computed(() => {
  return textfieldVariants({
    state: props.disabled ? 'disabled' : props.error ? 'error' : 'default',
    size: props.size,
  });
});

const inputClass = computed(() => {
  return inputVariants({
    size: props.size,
    hasPrefix: hasPrefix.value,
    hasSuffix: hasSuffix.value,
  });
});

const iconSizeMap: Record<string, string> = {
  sm: '0.75rem',
  md: '1.125rem',
  lg: '1.25rem',
};

const iconSizeStyle = computed(() => ({
  fontSize: iconSizeMap[props.size || 'md'],
}));

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div :class="containerClass">
    <!-- Prefix Icon Slot -->
    <div
      v-if="hasPrefix"
      class="flex items-center justify-center text-gray-400"
      :style="iconSizeStyle"
    >
      <slot name="prefix" />
    </div>

    <!-- Input Field -->
    <input
      v-bind="$attrs"
      :id="props.id"
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :class="inputClass"
      @input="onInput"
    />

    <!-- Suffix Icon Slot -->
    <div
      v-if="hasSuffix"
      class="flex items-center justify-center text-gray-400"
      :style="iconSizeStyle"
    >
      <slot name="suffix" />
    </div>
  </div>
</template>
