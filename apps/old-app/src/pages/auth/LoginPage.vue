<script setup lang="ts">
import FormLogin from './components/FormLogin.vue';
</script>
<template>
  <div class="w-full h-dvh flex items-center justify-center bg-stone-100">
    <div
      class="w-3xl h-120 bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-2"
    >
      <div class="bg-teal-500 w-full h-full"></div>
      <FormLogin />
    </div>
  </div>
</template>
