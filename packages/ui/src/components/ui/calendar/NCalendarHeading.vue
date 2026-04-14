<script setup lang="ts">
import { CalendarHeading, useForwardProps } from 'reka-ui';
import type { CalendarHeadingProps } from 'reka-ui';

const props = defineProps<CalendarHeadingProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarHeading v-bind="forwardedProps" class="text-sm font-semibold text-gray-800">
    <slot />
  </CalendarHeading>
</template>
