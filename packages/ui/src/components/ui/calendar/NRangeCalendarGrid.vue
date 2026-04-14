<script setup lang="ts">
import { RangeCalendarGrid, useForwardProps } from 'reka-ui';
import type { RangeCalendarGridProps } from 'reka-ui';
import { calendarGridVariants } from './ncalendar.variants';

const props = defineProps<RangeCalendarGridProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarGrid v-bind="forwardedProps" :class="calendarGridVariants()">
    <slot />
  </RangeCalendarGrid>
</template>
