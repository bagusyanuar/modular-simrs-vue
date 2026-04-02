<script setup lang="ts">
import { Input } from '#shadcn/components/ui/input';

interface Props {
  type?: string;
  placeholder?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
});
</script>

<template>
  <Input
    :id="props.id"
    :type="props.type"
    :placeholder="props.placeholder"
    class="focus-visible:ring-1 focus-visible:ring-orange-500/30 focus-visible:border-orange-500 transition-all ease-in-out duration-300"
    v-bind="$attrs"
  />
</template>
