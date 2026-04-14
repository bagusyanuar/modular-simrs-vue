<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui';
import { useForwardPropsEmits } from 'reka-ui';
import {
  NDialog,
  NDialogContent,
  NDialogDescription,
  NDialogHeader,
  NDialogTitle,
} from '#components/ui/dialog';
import NCommand from './NCommand.vue';

const props = withDefaults(
  defineProps<
    DialogRootProps & {
      title?: string;
      description?: string;
    }
  >(),
  {
    title: 'Command Palette',
    description: 'Search for a command to run...',
  }
);
const emits = defineEmits<DialogRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <NDialog v-slot="slotProps" v-bind="forwarded">
    <NDialogContent class="overflow-hidden p-0">
      <NDialogHeader class="sr-only">
        <NDialogTitle>{{ title }}</NDialogTitle>
        <NDialogDescription>{{ description }}</NDialogDescription>
      </NDialogHeader>
      <NCommand>
        <slot v-bind="slotProps" />
      </NCommand>
    </NDialogContent>
  </NDialog>
</template>
