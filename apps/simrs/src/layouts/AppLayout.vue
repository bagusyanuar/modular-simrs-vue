<script setup lang="ts"></script>
<template>
  <main class="w-full h-dvh">
    <div class="w-64 h-dvh fixed bg-teal-500 top-0 left-0 z-10"></div>
    <div class="w-full min-h-dvh ps-64 bg-stone-50">
      <router-view />
    </div>
  </main>
</template>
