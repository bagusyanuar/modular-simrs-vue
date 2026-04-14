<script setup lang="ts">
import { ref, provide, watch, onMounted } from 'vue';
import { CollapsibleRoot } from 'reka-ui';

interface Props {
  defaultOpen?: boolean;
}

const props = defineProps<Props>();
const isOpen = ref(props.defaultOpen || false);

// Logic to auto-expand when a child reports being active
const reportActive = () => {
  isOpen.value = true;
};

provide('n-sidebar-sub', {
  reportActive,
});

defineExpose({
  isOpen,
});
</script>

<template>
  <CollapsibleRoot v-model:open="isOpen" class="w-full">
    <slot />
  </CollapsibleRoot>
</template>
