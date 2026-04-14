<script setup lang="ts">
import { computed, useId } from 'vue';
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui';
import { Icon } from '@iconify/vue';
import { checkboxVariants } from './ncheckbox.variants';

interface Props {
  modelValue?: boolean | 'indeterminate';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});


const model = defineModel<boolean | 'indeterminate'>({ default: false });
const generatedId = useId();
const activeId = computed(() => props.id || generatedId);

const checkboxClass = computed(() => {
  return checkboxVariants({
    size: props.size,
    error: props.error,
  });
});

const iconSizeMap: Record<string, string> = {
  sm: '12px',
  md: '14px',
  lg: '16px',
};

const iconSize = computed(() => iconSizeMap[props.size] || '14px');

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div class="flex items-center gap-2 group">
    <CheckboxRoot
      v-bind="$attrs"
      :id="activeId"
      v-model:checked="model"
      :disabled="props.disabled"
      :class="checkboxClass"
      data-reka-checkbox
    >
      <CheckboxIndicator class="flex h-full w-full items-center justify-center text-white">
        <Icon 
          v-if="model === 'indeterminate'" 
          icon="lucide:minus" 
          :style="{ fontSize: iconSize }" 
          stroke-width="4"
        />
        <Icon 
          v-else 
          icon="lucide:check" 
          :style="{ fontSize: iconSize }" 
          stroke-width="4"
        />
      </CheckboxIndicator>
    </CheckboxRoot>
    
    <label
      v-if="props.label || $slots.default"
      :for="activeId"
      class="text-sm font-medium leading-none select-none cursor-pointer group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-70"
      :class="{
        'text-xs': props.size === 'sm',
        'text-sm': props.size === 'md',
        'text-base': props.size === 'lg',
        'text-red-500': props.error,
        'text-foreground': !props.error,
      }"
    >
      <slot>{{ props.label }}</slot>
    </label>
  </div>
</template>
