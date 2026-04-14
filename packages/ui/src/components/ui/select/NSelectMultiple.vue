<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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
  selectBadgeVariants,
} from './nselect.variants';

interface Props {
  modelValue?: any[];
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
  showIndicator?: boolean;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  size: 'md',
  options: () => [],
  showIndicator: true,
  clearable: false,
});

const emit = defineEmits<{
  (e: 'load-more'): void;
}>();

const model = defineModel<any[]>({ default: [] });
const search = defineModel<string>('searchTerm', { default: '' });

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

const optionsMap = computed(() => {
  return new Map(props.options.map((opt) => [opt.value, opt.label]));
});

const getLabel = (value: any) => {
  return optionsMap.value.get(value) || value?.toString();
};

const removeValue = (value: any) => {
  model.value = model.value.filter((v) => v !== value);
};

const handleClearAll = (e: MouseEvent) => {
  e.stopPropagation();
  model.value = [];
  search.value = '';
};

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

const badgeClass = computed(() => {
  return selectBadgeVariants({
    size: props.size,
  });
});

const iconSizeMap: Record<string, string> = {
  sm: '14px',
  md: '16px',
  lg: '20px',
};

const iconSize = computed(() => iconSizeMap[props.size] || '16px');

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <ComboboxRoot
    v-model="model"
    v-model:search-term="search"
    multiple
    :disabled="props.disabled"
    :filter-algorithm="props.remote ? () => true : undefined"
    class="w-full"
  >
    <ComboboxAnchor
      :class="[containerClass, 'h-auto min-h-10 py-1.5 flex-wrap']"
    >
      <!-- Selected Tags -->
      <div v-if="model.length > 0" class="flex flex-wrap gap-1 px-1">
        <div v-for="val in model" :key="val" :class="badgeClass">
          <span>{{ getLabel(val) }}</span>
          <button
            type="button"
            class="hover:text-red-500 transition-colors"
            @click.stop="removeValue(val)"
          >
            <Icon icon="lucide:x" :style="{ fontSize: '12px' }" />
          </button>
        </div>
      </div>

      <ComboboxInput
        v-bind="$attrs"
        :id="props.id"
        :placeholder="model.length === 0 ? props.placeholder : ''"
        :class="[inputClass, 'min-w-[50px] flex-1']"
      />

      <div class="flex items-center gap-2">
        <!-- Clear All Button -->
        <button
          v-if="props.clearable && model.length > 0"
          type="button"
          class="flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
          @click="handleClearAll"
        >
          <Icon icon="lucide:circle-x" :style="{ fontSize: iconSize }" />
        </button>

        <!-- Loading Spinner -->
        <Icon
          v-if="props.loading"
          icon="lucide:loader-2"
          class="animate-spin text-gray-400"
          :style="{ fontSize: iconSize }"
        />

        <!-- Trigger/Chevron -->
        <ComboboxTrigger
          class="flex items-center justify-center text-gray-400 hover:text-foreground transition-colors pr-1"
        >
          <Icon icon="lucide:chevron-down" :style="{ fontSize: iconSize }" />
        </ComboboxTrigger>
      </div>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        :class="contentClass"
        position="popper"
        :side-offset="6"
        align="start"
        class="w-(--reka-combobox-trigger-width) min-w-(--reka-combobox-trigger-width) outline-none bg-background shadow-2xl overflow-hidden"
      >
        <ComboboxViewport
          ref="viewportRef"
          class="max-h-60 overflow-y-auto p-1"
        >
          <ComboboxEmpty class="py-6 text-center text-sm text-gray-400">
            No results found.
          </ComboboxEmpty>

          <ComboboxItem
            v-for="opt in props.options"
            :key="opt.value"
            :value="opt.value"
            :disabled="opt.disabled"
            :class="itemClass"
            :data-state="model.includes(opt.value) ? 'checked' : 'unchecked'"
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
