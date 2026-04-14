<script setup lang="ts">
import { CalendarCellTrigger, useForwardProps } from 'reka-ui';
import type { CalendarCellTriggerProps } from 'reka-ui';
import { calendarCellTriggerVariants } from './ncalendar.variants';

const props = defineProps<CalendarCellTriggerProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarCellTrigger
    v-bind="forwardedProps"
    :class="calendarCellTriggerVariants()"
  >
    <slot />
  </CalendarCellTrigger>
</template>
