<script setup lang="ts">
import { onMounted, nextTick } from 'vue';

onMounted(() => {
  nextTick(() => {
    // Ensure the browser has a chance to paint the first frame of the app
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const loader = document.getElementById('global-loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.visibility = 'hidden';
          }, 500);
        }
      });
    });
  });
});
</script>

<template>
  <RouterView />
</template>
