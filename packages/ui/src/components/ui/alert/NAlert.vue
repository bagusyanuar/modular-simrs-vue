<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { type VariantProps } from 'class-variance-authority';
import { alertVariants } from './alert.variants';
import { cn } from '@/components/lib/utils';
import { Icon } from '@iconify/vue';
import NTypography from '@/components/ui/typography/NTypography.vue';

type AlertVariant = VariantProps<typeof alertVariants>;

interface Props {
  type: AlertVariant['type'];
  class?: HTMLAttributes['class'];
  title?: string;
  message?: string;
}
const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: 'Info',
  message: 'This is an info alert',
});

const mergedClass = computed(() => {
  return cn(alertVariants({ type: props.type }), props.class);
});
</script>

<template>
  <div :class="mergedClass">
    <div>
      <Icon icon="lucide:info" class="text-primary-500 w-ns-5 h-ns-5" />
    </div>
    <div class="flex-1 flex flex-col gap-ns-2">
      <NTypography variant="subtitle-md" class="text-neutral-950">
        {{ props.title }}
      </NTypography>
      <NTypography variant="body-sm" class="text-neutral-700">
        {{ props.message }}
      </NTypography>
    </div>
    <div>
      <Icon icon="lucide:x" class="text-neutral-950 w-ns-5 h-ns-5" />
    </div>
  </div>
</template>
