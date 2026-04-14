<script setup lang="ts">
import { RangeCalendarPrev, useForwardProps } from 'reka-ui';
import type { RangeCalendarPrevProps } from 'reka-ui';
import { Icon } from '@iconify/vue';
import { calendarNavButtonVariants } from './ncalendar.variants';

const props = defineProps<RangeCalendarPrevProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarPrev v-bind="forwardedProps" :class="calendarNavButtonVariants()">
    <slot>
      <Icon icon="lucide:chevron-left" class="h-4 w-4" />
    </slot>
  </RangeCalendarPrev>
</template>
