<script lang="ts" setup>
import { Hospital } from 'lucide-vue-next';
</script>

<template>
  <div class="bg-teal-500 w-full h-full p-8 flex flex-col">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 bg-white flex items-center justify-center rounded-lg shadow shadow-white/30">
        <Hospital class="w-6 h-6 text-teal-500" />
      </div>
      <div class="flex flex-col">
        <span class="text-white font-bold text-lg leading-none">Simulasi Neurovi</span>
        <span class="text-white/70 text-sm leading-none">Aplikasi Simulasi Rumah Sakit</span>
      </div>
    </div>
  </div>
</template>
