<script setup lang="ts">
import { RangeCalendarHeading, useForwardProps } from 'reka-ui';
import type { RangeCalendarHeadingProps } from 'reka-ui';

const props = defineProps<RangeCalendarHeadingProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarHeading v-bind="forwardedProps" class="text-sm font-semibold text-gray-800">
    <slot />
  </RangeCalendarHeading>
</template>
