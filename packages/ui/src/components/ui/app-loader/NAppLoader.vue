<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  show: boolean;
  logo?: string;
  title?: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: 'Neurovi SIMRS',
  description: 'Mempersiapkan modul sistem...',
});

const isVisible = computed(() => props.show);
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-stone-50/80 backdrop-blur-2xl"
    >
      <!-- Top Progress Line -->
      <div class="fixed top-0 left-0 w-full h-1 overflow-hidden bg-stone-100">
        <div class="h-full bg-brand animate-progress-indeterminate"></div>
      </div>

      <!-- Main Content -->
      <div class="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-700">
        <!-- Logo Container with Glow -->
        <div class="relative">
          <div
            class="absolute inset-0 bg-brand/20 blur-3xl rounded-full scale-150 animate-pulse"
          ></div>
          <img
            v-if="logo"
            :src="logo"
            alt="Logo"
            class="relative w-24 h-24 object-contain animate-bounce-subtle"
          />
          <div
            v-else
            class="relative w-24 h-24 bg-brand rounded-2xl flex items-center justify-center shadow-2xl shadow-brand/20"
          >
            <span class="text-white text-3xl font-bold">N</span>
          </div>
        </div>

        <!-- Text Info -->
        <div class="flex flex-col items-center text-center gap-2">
          <h2 class="text-xl font-bold text-stone-800 tracking-tight">
            {{ title }}
          </h2>
          <p class="text-sm text-stone-500 font-medium animate-pulse">
            {{ description }}
          </p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="absolute bottom-10 text-[10px] text-stone-400 font-mono tracking-widest uppercase">
        Enterprise Medical Environment
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.bg-brand {
  background-color: #0ea5e9; /* Sky-500 default, adapt if needed */
}

@keyframes progress-indeterminate {
  0% { transform: translateX(-100%); width: 30%; }
  50% { transform: translateX(0%); width: 40%; }
  100% { transform: translateX(100%); width: 30%; }
}

.animate-progress-indeterminate {
  animation: progress-indeterminate 2s infinite linear;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s infinite ease-in-out;
}
</style>
