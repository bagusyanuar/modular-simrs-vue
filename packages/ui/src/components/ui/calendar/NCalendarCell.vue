<script setup lang="ts">
import { CalendarCell, useForwardProps } from 'reka-ui';
import type { CalendarCellProps } from 'reka-ui';
import { calendarCellVariants } from './ncalendar.variants';

const props = defineProps<CalendarCellProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarCell v-bind="forwardedProps" :class="calendarCellVariants()">
    <slot />
  </CalendarCell>
</template>
