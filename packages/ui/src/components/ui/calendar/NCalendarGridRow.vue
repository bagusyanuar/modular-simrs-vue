<script setup lang="ts">
import { CalendarGridRow, useForwardProps } from 'reka-ui';
import type { CalendarGridRowProps } from 'reka-ui';

const props = defineProps<CalendarGridRowProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarGridRow v-bind="forwardedProps" class="flex w-full mt-2">
    <slot />
  </CalendarGridRow>
</template>
