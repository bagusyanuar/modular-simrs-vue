<script setup lang="ts">
import { computed } from 'vue';
import {
  TooltipContent,
  type TooltipContentEmits,
  type TooltipContentProps,
  TooltipPortal,
  TooltipArrow,
  useForwardPropsEmits,
} from 'reka-ui';
import { tooltipVariants } from './ntooltip.variants';

interface Props extends TooltipContentProps {
  class?: string;
  showArrow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sideOffset: 4,
  showArrow: false,
});

const emits = defineEmits<TooltipContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);

const contentClass = computed(() =>
  tooltipVariants({
    class: props.class,
  })
);
</script>

<template>
  <TooltipPortal>
    <TooltipContent v-bind="forwarded" :class="contentClass">
      <slot />
      <TooltipArrow
        v-if="showArrow"
        class="fill-foreground"
        :width="10"
        :height="5"
      />
    </TooltipContent>
  </TooltipPortal>
</template>
