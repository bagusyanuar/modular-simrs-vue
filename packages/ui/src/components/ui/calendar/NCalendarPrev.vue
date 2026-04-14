<script setup lang="ts">
import { CalendarPrev, useForwardProps } from 'reka-ui';
import type { CalendarPrevProps } from 'reka-ui';
import { Icon } from '@iconify/vue';
import { calendarNavButtonVariants } from './ncalendar.variants';

const props = defineProps<CalendarPrevProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarPrev v-bind="forwardedProps" :class="calendarNavButtonVariants()">
    <slot>
      <Icon icon="lucide:chevron-left" class="h-4 w-4" />
    </slot>
  </CalendarPrev>
</template>
