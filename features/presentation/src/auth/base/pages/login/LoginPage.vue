<script lang="ts" setup>
import FormLogin from '../../components/login/FormLogin.vue';
import IllustrationPanel from '../../components/login/IllustrationPanel.vue';
</script>

<template>
  <div class="w-ful h-dvh bg-stone-50 flex items-center justify-center">
    <div
      class="w-3xl h-120 bg-white rounded-xl shadow-xl overflow-hidden grid grid-cols-2"
    >
      <IllustrationPanel />
      <FormLogin />
    </div>
  </div>
</template>
