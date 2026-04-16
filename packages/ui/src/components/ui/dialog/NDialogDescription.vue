<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { DialogDescription, type DialogDescriptionProps, useForwardProps } from 'reka-ui';
import { cn } from '../../lib/utils';

interface Props extends DialogDescriptionProps {
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();

const forwardedProps = useForwardProps(props);
</script>

<template>
  <DialogDescription
    v-bind="forwardedProps"
    :class="cn('text-sm text-stone-500', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
