<script setup lang="ts">
import { RangeCalendarCell, useForwardProps } from 'reka-ui';
import type { RangeCalendarCellProps } from 'reka-ui';
import { calendarCellVariants } from './ncalendar.variants';

const props = defineProps<RangeCalendarCellProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarCell v-bind="forwardedProps" :class="calendarCellVariants()">
    <slot />
  </RangeCalendarCell>
</template>
