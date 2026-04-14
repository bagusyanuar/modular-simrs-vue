<script setup lang="ts">
import { RangeCalendarGridRow, useForwardProps } from 'reka-ui';
import type { RangeCalendarGridRowProps } from 'reka-ui';

const props = defineProps<RangeCalendarGridRowProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarGridRow v-bind="forwardedProps" class="flex w-full mt-2">
    <slot />
  </RangeCalendarGridRow>
</template>
