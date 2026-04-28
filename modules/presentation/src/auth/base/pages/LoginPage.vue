<script setup lang="ts">
import IllustrationPanel from '../components/IllustrationPanel.vue';
import LoginForm from '../components/LoginForm.vue';
</script>

<template>
  <div
    class="w-full h-dvh bg-stone-100 flex items-center justify-center p-4 selection:bg-teal-100"
  >
    <div
      class="w-full max-w-4xl h-full max-h-[600px] bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-stone-200/50"
    >
      <IllustrationPanel />
      <div
        class="relative flex flex-col justify-center bg-white shadow-[-1px_0_0_0_rgba(0,0,0,0.05)]"
      >
        <LoginForm />
      </div>
    </div>
  </div>
</template>
