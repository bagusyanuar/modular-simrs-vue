<script setup lang="ts">
import { computed } from 'vue';
import {
  PopoverContent,
  type PopoverContentEmits,
  type PopoverContentProps,
  PopoverPortal,
  PopoverArrow,
  useForwardPropsEmits,
} from 'reka-ui';
import { popoverVariants } from './npopover.variants';

interface Props extends PopoverContentProps {
  class?: string;
  showArrow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sideOffset: 8,
  showArrow: false,
});
const emits = defineEmits<PopoverContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);

const contentClass = computed(() =>
  popoverVariants({
    class: props.class,
  }),
);
</script>

<template>
  <PopoverPortal>
    <PopoverContent v-bind="forwarded" :class="contentClass">
      <slot />
      <PopoverArrow
        v-if="showArrow"
        class="stroke-[1px]"
        :width="12"
        :height="6"
        :style="{
          fill: 'var(--background)',
          stroke: 'var(--border)',
        }"
      />
    </PopoverContent>
  </PopoverPortal>
</template>
