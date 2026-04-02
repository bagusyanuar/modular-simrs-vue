<script setup lang="ts">
import { GButton } from '@genrs/ui/components/button';
import { GTextfield } from '@genrs/ui/components/textfield';
import { GLabel } from '@genrs/ui/components/label';
import { cn } from '@genrs/ui/utils';
</script>

<template>
  <main
    class="min-h-screen w-full flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-950 font-sans relative overflow-hidden"
  >
    <!-- Background Decals for Premium Look -->
    <div
      class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-stone-400/20 dark:bg-stone-800/40 rounded-full blur-3xl pointer-events-none"
    ></div>

    <!-- Login Card -->
    <div class="relative w-full max-w-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-4xl p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-black/50 border border-white/60 dark:border-stone-800/60 transition-all">
      
      <!-- Header -->
      <div class="mb-8 text-center flex flex-col items-center">
        <div class="w-14 h-14 bg-linear-to-br from-stone-800 to-stone-900 dark:from-stone-100 dark:to-stone-300 text-white dark:text-stone-900 rounded-2xl flex items-center justify-center font-bold text-2xl mb-5 shadow-lg shadow-stone-900/20 dark:shadow-stone-100/10">
          G
        </div>
        <h1 class="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">Silakan Masuk</h1>
        <p class="text-sm text-stone-500 dark:text-stone-400 mt-2">Gunakan kredensial Anda untuk mengakses portal SIMRS.</p>
      </div>

      <!-- Form Layout -->
      <form class="space-y-5" @submit.prevent>
        <div class="space-y-2">
          <GLabel
            for="username"
            class="text-sm font-medium text-stone-700 dark:text-stone-300"
            >Username</GLabel
          >
          <GTextfield
            id="username"
            type="text"
            placeholder="Masukkan username"
            class="h-11 rounded-xl bg-stone-50/50 dark:bg-stone-950/50"
          />
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <GLabel
              for="password"
              class="text-sm font-medium text-stone-700 dark:text-stone-300"
              >Password</GLabel
            >
            <a
              href="#"
              class="text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >Lupa sandi?</a
            >
          </div>
          <GTextfield
            id="password"
            type="password"
            placeholder="••••••••"
            class="h-11 rounded-xl bg-stone-50/50 dark:bg-stone-950/50"
          />
        </div>

        <GButton
          text="Masuk ke Sistem"
          :class="
            cn(
              'w-full mt-6 py-6 text-base font-medium rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white shadow-md transition-all active:scale-[0.98]'
            )
          "
        />
      </form>

      <!-- Footer -->
      <p class="mt-8 text-center text-sm text-stone-500 dark:text-stone-400">
        Belum punya akses?
        <a
          href="#"
          class="font-medium text-stone-900 dark:text-stone-100 hover:underline underline-offset-4 transition-colors"
          >Hubungi Tim IT</a
        >
      </p>
    </div>
  </main>
</template>
