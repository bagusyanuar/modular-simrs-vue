<script setup lang="ts">
import { ref, computed } from 'vue';
import { useVModel } from '@vueuse/core';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import {
  NPopover,
  NPopoverTrigger,
  NPopoverContent,
} from '#components/ui/popover';
import {
  NCommand,
  NCommandInput,
  NCommandList,
  NCommandEmpty,
  NCommandGroup,
  NCommandItem,
} from '#components/ui/command';
import { NButton } from '#components/ui/button';
import { cn } from '#components/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface Props {
  modelValue?: string;
  options?: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  placeholder: 'Select option...',
  searchPlaceholder: 'Search...',
  emptyMessage: 'No results found.',
  class: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit);
const open = ref(false);

const selectedLabel = computed(() => {
  return (
    props.options.find((opt) => opt.value === modelValue.value)?.label ||
    props.placeholder
  );
});
</script>

<template>
  <NPopover v-model:open="open">
    <NPopoverTrigger as-child>
      <NButton
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :class="cn('w-[300px] flex justify-between font-normal', props.class)"
      >
        <span class="truncate">{{ selectedLabel }}</span>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </NButton>
    </NPopoverTrigger>
    <NPopoverContent class="w-full p-0" align="start">
      <NCommand>
        <NCommandInput :placeholder="props.searchPlaceholder" />
        <NCommandList>
          <NCommandEmpty>{{ props.emptyMessage }}</NCommandEmpty>
          <NCommandGroup>
            <NCommandItem
              v-for="option in props.options"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
              @select="
                () => {
                  modelValue = option.value;
                  open = false;
                }
              "
            >
              <Check
                :class="
                  cn(
                    'mr-2 h-4 w-4',
                    modelValue === option.value ? 'opacity-100' : 'opacity-0'
                  )
                "
              />
              {{ option.label }}
            </NCommandItem>
          </NCommandGroup>
        </NCommandList>
      </NCommand>
    </NPopoverContent>
  </NPopover>
</template>
