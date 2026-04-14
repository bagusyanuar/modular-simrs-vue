<script setup lang="ts">
import { RangeCalendarHeadCell, useForwardProps } from 'reka-ui';
import type { RangeCalendarHeadCellProps } from 'reka-ui';
import { calendarHeadCellVariants } from './ncalendar.variants';

const props = defineProps<RangeCalendarHeadCellProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarHeadCell v-bind="forwardedProps" :class="calendarHeadCellVariants()">
    <slot />
  </RangeCalendarHeadCell>
</template>
