<script setup lang="ts">
import { RangeCalendarCellTrigger, useForwardProps } from 'reka-ui';
import type { RangeCalendarCellTriggerProps } from 'reka-ui';
import { calendarCellTriggerVariants } from './ncalendar.variants';

const props = defineProps<RangeCalendarCellTriggerProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarCellTrigger
    v-bind="forwardedProps"
    :class="calendarCellTriggerVariants()"
  >
    <slot />
  </RangeCalendarCellTrigger>
</template>
