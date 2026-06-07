<script setup lang="ts">
import { computed } from 'vue';
import { buttonGroupVariants, type ButtonGroupVariants } from './nbutton-group.variants';

interface Props {
  orientation?: 'horizontal' | 'vertical';
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
});

const classes = computed(() => buttonGroupVariants({
  orientation: props.orientation,
}));
</script>

<template>
  <div :class="classes" v-bind="$attrs" role="group">
    <slot />
  </div>
</template>

<style scoped>
/* Reset children border radius */
:deep(> *) {
  border-radius: 0 !important;
}

/* Orientation: Horizontal */
.flex-row > :deep(:first-child) {
  border-top-left-radius: var(--radius-md, 0.375rem) !important;
  border-bottom-left-radius: var(--radius-md, 0.375rem) !important;
}

.flex-row > :deep(:last-child) {
  border-top-right-radius: var(--radius-md, 0.375rem) !important;
  border-bottom-right-radius: var(--radius-md, 0.375rem) !important;
}

.flex-row > :deep(*:not(:first-child)) {
  margin-left: -1px;
}

/* Orientation: Vertical */
.flex-col > :deep(:first-child) {
  border-top-left-radius: var(--radius-md, 0.375rem) !important;
  border-top-right-radius: var(--radius-md, 0.375rem) !important;
}

.flex-col > :deep(:last-child) {
  border-bottom-left-radius: var(--radius-md, 0.375rem) !important;
  border-bottom-right-radius: var(--radius-md, 0.375rem) !important;
}

.flex-col > :deep(*:not(:first-child)) {
  margin-top: -1px;
}

/* Ensure focus states are above borders */
:deep(> *:focus),
:deep(> *:focus-visible),
:deep(> *.active) {
  z-index: 10;
}
</style>
