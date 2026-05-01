<script setup lang="ts">
import { useRouter } from 'vue-router';
import illustrationUrl from '../../assets/images/404-illustration.png';

const router = useRouter();

const goHome = (): void => {
  router.push('/');
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 overflow-hidden relative font-sans"
  >
    <!-- Decorative Background -->
    <div
      class="absolute -top-32 -left-32 w-lg h-128 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
    ></div>
    <div
      class="absolute -bottom-32 -right-32 w-lg h-128 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-700"
    ></div>

    <div
      class="relative z-10 text-center max-w-sm w-full flex flex-col items-center pt-4"
    >
      <!-- Illustration with Floating Button Overlay -->
      <div class="relative group w-full mb-2">
        <div class="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-75"></div>
        <img
          :src="illustrationUrl"
          alt="404 Not Found"
          class="w-full h-auto relative drop-shadow-2xl"
        />

        <!-- Floating Button Overlay -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-12">
          <button
            class="w-full backdrop-blur-md bg-indigo-600/90 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-white/20"
            @click="goHome"
          >
            Balik ke Beranda
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Compact Text -->
      <div class="space-y-1">
        <h2
          class="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight"
        >
          Halaman Hilang, Bosku!
        </h2>
        <p
          class="text-slate-500 dark:text-slate-400 text-xs font-medium max-w-[240px] mx-auto leading-relaxed"
        >
          Tenang, klik tombol di atas buat balik ke jalan yang benar.
        </p>
      </div>
    </div>

    <!-- System Info Footer -->
    <div
      class="absolute bottom-6 flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]"
    >
      <span>Modular SIMRS</span>
      <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
      <span>v2.0.0</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}
.animate-pulse {
  animation: pulse 4s infinite;
}
.w-lg {
  width: 32rem;
}
.h-128 {
  height: 32rem;
}
</style>
