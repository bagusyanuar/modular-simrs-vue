<script setup lang="ts">
import { CalendarGrid, useForwardProps } from 'reka-ui';
import type { CalendarGridProps } from 'reka-ui';
import { calendarGridVariants } from './ncalendar.variants';

const props = defineProps<CalendarGridProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarGrid v-bind="forwardedProps" :class="calendarGridVariants()">
    <slot />
  </CalendarGrid>
</template>
