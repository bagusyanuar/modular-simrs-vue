<script setup lang="ts">
import { ref, provide, watch, onMounted, reactive, computed } from 'vue';
import { CollapsibleRoot } from 'reka-ui';

interface Props {
  defaultOpen?: boolean;
}

const props = defineProps<Props>();
const isOpen = ref(props.defaultOpen || false);

// Registry untuk melacak anak mana saja yang aktif
const activeRegistry = reactive<Record<string, boolean>>({});

const reportActive = (id: string, isActive: boolean) => {
  activeRegistry[id] = isActive;
};

provide('n-sidebar-sub', {
  reportActive,
});

const hasActiveChild = computed(() =>
  Object.values(activeRegistry).some(Boolean)
);

// Auto-expand jika ada anak yang aktif
watch(
  hasActiveChild,
  (active) => {
    if (active) isOpen.value = true;
  },
  { immediate: true }
);

defineExpose({
  isOpen,
});
</script>

<template>
  <CollapsibleRoot v-model:open="isOpen" class="w-full">
    <slot />
  </CollapsibleRoot>
</template>
