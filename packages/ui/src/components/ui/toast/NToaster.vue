<script setup lang="ts">
import { Toaster, type ToasterProps } from 'vue-sonner';
import { toastClasses, toasterVariants } from './ntoaster.variants';

interface Props extends ToasterProps {
  class?: string;
  theme?: 'light' | 'dark' | 'system';
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-right',
  expand: false,
  richColors: true,
  closeButton: true,
  theme: 'light',
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <Toaster
    v-bind="$attrs"
    :theme="props.theme"
    :position="props.position"
    :rich-colors="props.richColors"
    :expand="props.expand"
    :close-button="props.closeButton"
    :class="toasterVariants({ theme: props.theme, class: props.class })"
    :toast-options="{
      classes: {
        toast: toastClasses.toast,
        description: toastClasses.description,
        actionButton: toastClasses.actionButton,
        cancelButton: toastClasses.cancelButton,
        closeButton: toastClasses.closeButton,
        success: toastClasses.success,
        error: toastClasses.error,
        warning: toastClasses.warning,
        info: toastClasses.info,
      },
    }"
  />
</template>
