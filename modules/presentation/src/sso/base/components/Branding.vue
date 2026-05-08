<script setup lang="ts">
// Slicing Only - No Logic
</script>

<template>
  <!-- Branding Side (Hidden on Mobile) -->
  <div
    class="hidden lg:flex relative flex-col justify-between p-12 text-white bg-teal-950 overflow-hidden"
  >
    <!-- Decorative Gradient Background -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-600/10 blur-[120px]"
      ></div>
    </div>

    <div
      class="relative z-10 flex items-center gap-3 text-2xl font-bold tracking-tight"
    >
      <div
        class="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-teal-500/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <span>Neurovi SSO</span>
    </div>

    <div class="relative z-10 max-w-lg">
      <blockquote class="space-y-4">
        <p class="text-2xl font-medium leading-relaxed">
          "Sistem Informasi Manajemen Rumah Sakit yang modular, cepat, dan
          aman. Mengelola data kesehatan menjadi lebih efisien dari
          sebelumnya."
        </p>
        <footer class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold text-xs text-teal-500"
          >
            N
          </div>
          <div>
            <div class="font-semibold text-sm text-white">Neurovi</div>
            <div class="text-xs text-zinc-500">Developer</div>
          </div>
        </footer>
      </blockquote>
    </div>

    <!-- Bottom Decoration -->
    <div class="relative z-10 flex gap-4 text-xs text-zinc-500">
      <span>&copy; 2026 Neurovi Corp</span>
      <span>&bull;</span>
      <a href="#" class="hover:text-teal-500 transition-colors"
        >Privacy Policy</a
      >
    </div>
  </div>
</template>
