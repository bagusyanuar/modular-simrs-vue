<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';
import {
  ComboboxRoot,
  ComboboxAnchor,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxViewport,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxEmpty,
  ComboboxPortal,
} from 'reka-ui';
import { Icon } from '@iconify/vue';
import { useInfiniteScroll } from '@vueuse/core';
import {
  selectVariants,
  selectInputVariants,
  selectContentVariants,
  selectItemVariants,
} from './nselect.variants';

interface Props {
  modelValue?: any;
  searchTerm?: string;
  options: Array<{ label: string; value: any; disabled?: boolean }>;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  loading?: boolean;
  loadingMore?: boolean;
  remote?: boolean;
  id?: string;
  displayValue?: (val: any) => string;
  showIndicator?: boolean;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  options: () => [],
  displayValue: (val: any) => val?.toString() || '',
  showIndicator: true,
  clearable: false,
});

const emit = defineEmits<{
  (e: 'load-more'): void;
}>();

const model = defineModel<any>();
const search = defineModel<string>('searchTerm', { default: '' });

const handleClear = (e: MouseEvent) => {
  e.stopPropagation();
  model.value = undefined;
  search.value = '';
};

const viewportRef = ref<HTMLElement | null>(null);

// Infinite Scroll Setup
useInfiniteScroll(
  viewportRef,
  () => {
    if (!props.loading && !props.loadingMore) {
      emit('load-more');
    }
  },
  { distance: 10 }
);

const containerClass = computed(() => {
  return selectVariants({
    state: props.disabled ? 'disabled' : props.error ? 'error' : 'default',
    size: props.size,
  });
});

const inputClass = computed(() => {
  return selectInputVariants({
    size: props.size,
  });
});

const contentClass = computed(() => {
  return selectContentVariants({
    size: props.size,
  });
});

const itemClass = computed(() => {
  return selectItemVariants({
    size: props.size,
  });
});

const iconSizeMap: Record<string, string> = {
  sm: '14px',
  md: '16px',
  lg: '20px',
};

const iconSize = computed(() => iconSizeMap[props.size] || '20px');

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <ComboboxRoot
    v-model="model"
    v-model:search-term="search"
    :disabled="props.disabled"
    :filter-algorithm="props.remote ? () => true : undefined"
    class="w-full"
  >
    <ComboboxAnchor :class="containerClass">
      <ComboboxInput
        v-bind="$attrs"
        :id="props.id"
        :placeholder="props.placeholder"
        :class="inputClass"
        :display-value="props.displayValue"
      />
      
      <div class="flex items-center gap-2">
        <!-- Clear Button -->
        <button
          v-if="props.clearable && model"
          type="button"
          class="flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
          @click="handleClear"
        >
          <Icon 
            icon="lucide:circle-x" 
            :style="{ fontSize: iconSize }"
          />
        </button>

        <!-- Loading Spinner -->
        <Icon 
          v-if="props.loading" 
          icon="lucide:loader-2" 
          class="animate-spin text-gray-400"
          :style="{ fontSize: iconSize }"
        />
        
        <!-- Trigger/Chevron -->
        <ComboboxTrigger class="flex items-center justify-center text-gray-400 hover:text-foreground transition-colors">
          <Icon 
            icon="lucide:chevron-down" 
            :style="{ fontSize: iconSize }"
          />
        </ComboboxTrigger>
      </div>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        :class="contentClass"
        position="popper"
        :side-offset="6"
        align="start"
        class="w-[var(--reka-combobox-trigger-width)] min-w-[var(--reka-combobox-trigger-width)] outline-none bg-background shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        <ComboboxViewport ref="viewportRef" class="max-h-60 overflow-y-auto p-1">
          <ComboboxEmpty class="py-6 text-center text-sm text-gray-400">
            No results found.
          </ComboboxEmpty>

          <ComboboxItem
            v-for="opt in props.options"
            :key="opt.value"
            :value="opt.value"
            :disabled="opt.disabled"
            :class="itemClass"
            :data-state="model === opt.value ? 'checked' : 'unchecked'"
          >
            <slot name="item" :option="opt">
              <span>{{ opt.label }}</span>
            </slot>
            
            <ComboboxItemIndicator 
              v-if="props.showIndicator"
              class="ml-auto inline-flex items-center justify-center"
            >
              <Icon icon="lucide:check" :style="{ fontSize: iconSize }" />
            </ComboboxItemIndicator>
          </ComboboxItem>

          <!-- Loading More Spinner -->
          <div 
            v-if="props.loadingMore" 
            class="flex items-center justify-center py-2 text-gray-400"
          >
            <Icon icon="lucide:loader-2" class="animate-spin" />
          </div>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
