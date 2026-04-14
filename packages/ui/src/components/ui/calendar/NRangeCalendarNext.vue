<script setup lang="ts">
import { RangeCalendarNext, useForwardProps } from 'reka-ui';
import type { RangeCalendarNextProps } from 'reka-ui';
import { Icon } from '@iconify/vue';
import { calendarNavButtonVariants } from './ncalendar.variants';

const props = defineProps<RangeCalendarNextProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarNext v-bind="forwardedProps" :class="calendarNavButtonVariants()">
    <slot>
      <Icon icon="lucide:chevron-right" class="h-4 w-4" />
    </slot>
  </RangeCalendarNext>
</template>
