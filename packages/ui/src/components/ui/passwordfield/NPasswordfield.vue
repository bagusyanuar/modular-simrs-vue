<script setup lang="ts">
import { ref, computed, useSlots } from 'vue';
import { Icon } from '@iconify/vue';
import { passwordfieldVariants, inputVariants } from './npasswordfield.variants';

interface Props {
  modelValue?: string | number;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Omit<Props, 'modelValue'>>(), {
  size: 'md',
});

const model = defineModel<string | number>({ default: '' });

const slots = useSlots();
const showPassword = ref(false);

const togglePassword = () => {
  if (props.disabled) return;
  showPassword.value = !showPassword.value;
};

const hasPrefix = computed(() => !!slots.prefix || true); // Always true because of default lock
const hasSuffix = computed(() => !!slots.suffix || true); // Always true because of default toggle

const containerClass = computed(() => {
  return passwordfieldVariants({
    state: props.disabled ? 'disabled' : props.error ? 'error' : 'default',
    size: props.size,
  });
});

const inputClass = computed(() => {
  return inputVariants({
    size: props.size,
  });
});

const iconSizeMap: Record<string, string> = {
  sm: '0.75rem',
  md: '1.125rem',
  lg: '1.25rem',
};

const iconSize = computed(() => iconSizeMap[props.size || 'md']);

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div :class="containerClass">
    <!-- Prefix Slot (Default to Lock) -->
    <div v-if="hasPrefix" class="flex items-center justify-center text-gray-400 pl-1">
      <slot name="prefix">
        <Icon icon="ph:lock" :style="{ fontSize: iconSize }" />
      </slot>
    </div>

    <!-- Input Field -->
    <input
      v-bind="$attrs"
      :id="props.id"
      :type="showPassword ? 'text' : 'password'"
      v-model="model"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :class="inputClass"
    />

    <!-- Suffix Slot (Default to Toggle) -->
    <div v-if="hasSuffix" class="flex items-center justify-center pr-1">
      <slot name="suffix">
        <button
          type="button"
          class="flex items-center justify-center text-gray-400 hover:text-brand transition-colors cursor-pointer disabled:cursor-not-allowed"
          @click="togglePassword"
          :disabled="props.disabled"
        >
          <Icon
            :icon="showPassword ? 'ph:eye-slash' : 'ph:eye'"
            :style="{ fontSize: iconSize }"
          />
        </button>
      </slot>
    </div>
  </div>
</template>
