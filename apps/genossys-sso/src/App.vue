<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.visibility = 'hidden';
    }, 500);
  }
});
</script>

<template>
  <RouterView />
</template>
