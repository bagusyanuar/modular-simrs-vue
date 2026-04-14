<script setup lang="ts">
import { CalendarHeadCell, useForwardProps } from 'reka-ui';
import type { CalendarHeadCellProps } from 'reka-ui';
import { calendarHeadCellVariants } from './ncalendar.variants';

const props = defineProps<CalendarHeadCellProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarHeadCell v-bind="forwardedProps" :class="calendarHeadCellVariants()">
    <slot />
  </CalendarHeadCell>
</template>
