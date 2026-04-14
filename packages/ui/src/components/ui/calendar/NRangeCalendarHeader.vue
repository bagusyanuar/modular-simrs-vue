<script setup lang="ts">
import { RangeCalendarHeader, useForwardProps } from 'reka-ui';
import type { RangeCalendarHeaderProps } from 'reka-ui';

const props = defineProps<RangeCalendarHeaderProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarHeader v-bind="forwardedProps" class="relative flex w-full items-center justify-between pb-4">
    <slot />
  </RangeCalendarHeader>
</template>
