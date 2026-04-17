<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import { NAppLoader } from '@genrs/ui/components/ui/app-loader';
import brandLogo from './assets/logo-rs.png';
import { ref, onMounted } from 'vue';

const isNavigating = ref(true);

onMounted(() => {
  // Hide initial mount loader
  setTimeout(() => {
    isNavigating.value = false;
  }, 800);

  // Global click interceptor for external app links
  window.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('a');
    if (target && target.getAttribute('href') && !target.getAttribute('to')) {
      const href = target.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        isNavigating.value = true;
      }
    }
  });
});
</script>

<template>
  <NAppLoader :show="isNavigating" :logo="brandLogo" />
  <router-view></router-view>
  <Toaster position="top-right" rich-colors close-button />
</template>

