<script setup lang="ts">
import { CalendarNext, useForwardProps } from 'reka-ui';
import type { CalendarNextProps } from 'reka-ui';
import { Icon } from '@iconify/vue';
import { calendarNavButtonVariants } from './ncalendar.variants';

const props = defineProps<CalendarNextProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarNext v-bind="forwardedProps" :class="calendarNavButtonVariants()">
    <slot>
      <Icon icon="lucide:chevron-right" class="h-4 w-4" />
    </slot>
  </CalendarNext>
</template>
