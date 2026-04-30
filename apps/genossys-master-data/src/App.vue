<script setup lang="ts">
import { onMounted, nextTick } from 'vue';

onMounted(() => {
  nextTick(() => {
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
