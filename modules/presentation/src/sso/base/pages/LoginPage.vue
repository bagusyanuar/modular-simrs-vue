<script setup lang="ts">
import Branding from '../components/Branding.vue';
import LoginForm from '../components/LoginForm.vue';
</script>

<template>
  <div
    class="min-h-screen grid lg:grid-cols-2 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800"
  >
    <Branding />
    <LoginForm />
  </div>
</template>
