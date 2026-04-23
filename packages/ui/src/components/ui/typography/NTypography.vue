<script setup lang="ts">
import { computed, ref, type Component, type HTMLAttributes } from 'vue';
import { typographyVariants } from './typography.variants';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/components/lib/utils';

defineOptions({
  inheritAttrs: false,
});

type TypographyVariant = VariantProps<typeof typographyVariants>;
type TypographyTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'small'
  | 'blockquote';

interface Props {
  variant?: TypographyVariant['variant'];
  as?: TypographyTag | Component;
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'body-md',
  as: 'p',
});

const el = ref<HTMLElement | null>(null);

const mergedClass = computed(() => {
  return cn(typographyVariants({ variant: props.variant }), props.class);
});

defineExpose({
  el,
});
</script>

<template>
  <component :is="props.as" ref="el" :class="mergedClass" v-bind="$attrs">
    <slot />
  </component>
</template>
