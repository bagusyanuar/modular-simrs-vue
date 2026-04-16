<template>
  <div class="hidden md:flex flex-col items-center justify-center bg-teal-600 p-12 text-white relative h-full">
    <!-- Overlay Gradient for Depth -->
    <div class="absolute inset-0 bg-linear-to-br from-teal-500 to-emerald-700 opacity-90"></div>
    
    <!-- Pattern Overlay (Optional but premium) -->
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

    <div class="relative z-10 text-center">
      <!-- Branded Icon Placeholder -->
      <div class="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/20 shadow-2xl animate-pulse-slow">
         <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
         </svg>
      </div>
      
      <h1 class="text-4xl font-extrabold mb-2 tracking-tight">Neurovi SIMRS</h1>
      <p class="text-teal-100/80 text-lg font-medium max-w-[280px] leading-snug mx-auto">
        Sistem Informasi Manajemen Rumah Sakit Modular & Terintegrasi.
      </p>
    </div>

    <!-- Background Decorative Elements -->
    <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>
    <div class="absolute top-1/4 -right-10 w-40 h-40 bg-emerald-300/10 rounded-full blur-2xl"></div>
  </div>
</template>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}
.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
