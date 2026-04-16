<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'reka-ui';
import { NIcon as Icon } from '../../icons';
import { cn } from '../../lib/utils';
import { dialogOverlayVariants, dialogContentVariants } from './ndialog.variants';

interface Props extends DialogContentProps {
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
const emits = defineEmits<DialogContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);

const contentClass = computed(() => cn(dialogContentVariants(), props.class));
</script>

<template>
  <DialogPortal>
    <DialogOverlay :class="dialogOverlayVariants()" />
    <DialogContent
      v-bind="forwarded"
      :class="contentClass"
    >
      <slot />

      <DialogClose
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-stone-100 data-[state=open]:text-stone-500"
      >
        <Icon icon="lucide:x" class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
