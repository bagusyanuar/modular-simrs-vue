<script setup lang="ts">
import { ref, computed } from 'vue';
import { NPopover, NPopoverTrigger, NPopoverContent } from '../popover';
import NRangeCalendar from './NRangeCalendar.vue';
import { NButton } from '../button';
import { Icon } from '@iconify/vue';
import {
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date';
import type { DateRange } from 'reka-ui';

interface Props {
  placeholder?: string;
  locale?: string;
  disabled?: boolean;
  class?: string;
  error?: boolean;
  numberOfMonths?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select a date range',
  locale: 'en-US',
});

const modelValue = defineModel<DateRange>();
const isOpen = ref(false);

const df = computed(
  () =>
    new DateFormatter(props.locale, {
      dateStyle: 'medium',
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
          !modelValue?.start && !error && 'text-gray-400',
          props.class,
        ]"
      >
        <Icon
          icon="lucide:calendar"
          :class="['mr-2.5 h-4 w-4 shrink-0', error ? 'text-danger' : 'text-gray-400']"
        />
        <span class="truncate">
          <template v-if="modelValue?.start">
            <template v-if="modelValue.end">
              {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }} -
              {{ df.format(modelValue.end.toDate(getLocalTimeZone())) }}
            </template>
            <template v-else>
              {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }}
            </template>
          </template>
          <template v-else>
            {{ placeholder }}
          </template>
        </span>
      </NButton>
    </NPopoverTrigger>
    <NPopoverContent class="w-auto p-0 border-none shadow-none" :side-offset="8">
      <NRangeCalendar
        v-model="modelValue"
        initial-focus
        :locale="locale"
        :number-of-months="numberOfMonths"
      />
    </NPopoverContent>
  </NPopover>
</template>
