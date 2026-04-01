<script setup lang="ts">
import { Button } from '../../shadcn/components/ui/button';
interface ButtonProps {
  text?: string;
  class?: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  text: 'Button',
  class: '',
});
</script>

<template>
  <Button variant="default" :class="props.class">{{ props.text }}</Button>
</template>
