<script setup lang="ts">
import { NInput } from '@genrs/ui/components/ui/input';
import { NButton } from '@genrs/ui/components/ui/button';
</script>
<template>
  <div class="bg-white h-full w-full flex flex-col p-8">
    <div class="flex flex-col">
      <span class="text-neutral-500 font-bold text-lg">Masuk ke Akun Anda</span>
      <span class="text-neutral-500/70 text-sm">Masukkan informasi yang diperlukan untuk melanjutkan</span>
    </div>
    <div class="flex-1 flex flex-col justify-center gap-1.5">
      <div class="w-full">
        <span class="text-neutral-500/70 text-sm">Username</span>
        <NInput class="text-neutral-500" />
      </div>
      <div class="w-full mb-3">
        <span class="text-neutral-500/70 text-sm">Password</span>
        <NInput class="text-neutral-500" />
      </div>
      <NButton class="text-white w-full py-3">Masuk</NButton>
    </div>
  </div>
</template>
