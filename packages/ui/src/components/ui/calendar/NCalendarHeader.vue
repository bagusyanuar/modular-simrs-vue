<script setup lang="ts">
import { CalendarHeader, useForwardProps } from 'reka-ui';
import type { CalendarHeaderProps } from 'reka-ui';

const props = defineProps<CalendarHeaderProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarHeader v-bind="forwardedProps" class="relative flex w-full items-center justify-between pb-4">
    <slot />
  </CalendarHeader>
</template>
