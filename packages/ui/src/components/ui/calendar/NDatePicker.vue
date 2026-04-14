<script setup lang="ts">
import { ref, computed } from 'vue';
import { NPopover, NPopoverTrigger, NPopoverContent } from '../popover';
import NCalendar from './NCalendar.vue';
import { NButton } from '../button';
import { Icon } from '@iconify/vue';
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date';

interface Props {
  placeholder?: string;
  locale?: string;
  disabled?: boolean;
  class?: string;
  error?: boolean;
  numberOfMonths?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select a date',
  locale: 'en-US',
});

const modelValue = defineModel<DateValue>();
const isOpen = ref(false);

const df = computed(
  () =>
    new DateFormatter(props.locale, {
      dateStyle: 'long',
    })
);

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <NPopover v-model:open="isOpen">
    <NPopoverTrigger as-child>
      <NButton
        v-bind="$attrs"
        variant="outline"
        :disabled="disabled"
        :class="[
          'w-full justify-start text-left font-normal h-11 px-4 rounded-lg border-gray-200 transition-all shadow-none',
          error
            ? 'border-danger/50 text-danger bg-danger/5 hover:bg-danger/10 hover:border-danger'
            : 'hover:bg-gray-50 hover:border-gray-300',
          !modelValue && !error && 'text-gray-400',
          props.class,
        ]"
      >
        <Icon
          icon="lucide:calendar"
          :class="['mr-2.5 h-4 w-4 shrink-0', error ? 'text-danger' : 'text-gray-400']"
        />
        <span class="truncate">
          {{
            modelValue
              ? df.format(modelValue.toDate(getLocalTimeZone()))
              : placeholder
          }}
        </span>
      </NButton>
    </NPopoverTrigger>
    <NPopoverContent class="w-auto p-0 border-none shadow-none" :side-offset="8">
      <NCalendar
        v-model="modelValue"
        initial-focus
        :locale="locale"
        :number-of-months="numberOfMonths"
      />
    </NPopoverContent>
  </NPopover>
</template>
