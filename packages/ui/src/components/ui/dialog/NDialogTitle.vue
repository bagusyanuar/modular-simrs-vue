<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { DialogTitle, type DialogTitleProps, useForwardProps } from 'reka-ui';
import { cn } from '../../lib/utils';

interface Props extends DialogTitleProps {
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();

const forwardedProps = useForwardProps(props);
</script>

<template>
  <DialogTitle
    v-bind="forwardedProps"
    :class="cn('text-lg font-bold leading-none tracking-tight text-stone-900', props.class)"
  >
    <slot />
  </DialogTitle>
</template>
