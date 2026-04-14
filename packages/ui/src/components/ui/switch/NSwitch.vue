<script setup lang="ts">
import { computed } from 'vue';
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from 'reka-ui';
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui';
import { switchVariants, switchThumbVariants } from './nswitch.variants';

interface Props extends SwitchRootProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'danger';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'brand',
});

const emits = defineEmits<SwitchRootEmits>();
const modelValue = defineModel<boolean>();

const forwarded = useForwardPropsEmits(props, emits);

const rootClass = computed(() =>
  switchVariants({
    size: props.size,
    variant: props.variant,
    class: props.class,
  })
);

const thumbClass = computed(() =>
  switchThumbVariants({
    size: props.size,
  })
);
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    v-model:checked="modelValue"
    :class="rootClass"
  >
    <SwitchThumb :class="thumbClass" />
  </SwitchRoot>
</template>
