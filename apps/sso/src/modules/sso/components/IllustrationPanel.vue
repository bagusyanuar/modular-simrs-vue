<template>
  <div class="hidden md:flex flex-col justify-between bg-stone-900 p-12 text-white relative overflow-hidden">
    <!-- Ornamen Background -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

    <div class="relative z-10">
      <div class="w-12 h-1 bg-teal-500 mb-8"></div>
      <h3 class="text-4xl font-black tracking-tighter leading-none mb-6">
        MODULAR<br /><span class="text-teal-500">ECOSYSTEM</span>
      </h3>
      <p class="text-stone-400 text-sm font-medium leading-relaxed max-w-xs">
        Satu akun untuk semua layanan Neurovi Simulation. Cepat, Aman, dan Terintegrasi.
      </p>
    </div>

    <div class="relative z-10">
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-4 group cursor-default">
          <div class="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
            <span class="text-lg font-bold">01</span>
          </div>
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-stone-500 group-hover:text-white transition-colors">Secure PKCE</h4>
            <p class="text-[10px] text-stone-600 font-bold group-hover:text-stone-400">Military-grade protection</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4 group cursor-default">
          <div class="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
            <span class="text-lg font-bold">02</span>
          </div>
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-stone-500 group-hover:text-white transition-colors">Single Session</h4>
            <p class="text-[10px] text-stone-600 font-bold group-hover:text-stone-400">Login once, access everywhere</p>
          </div>
        </div>
      </div>

      <div class="mt-12 flex items-center gap-2 text-[10px] font-black text-stone-500 tracking-widest">
        <span>&copy; 2024 NEUROVI SIMULATION</span>
      </div>
    </div>
  </div>
</template>
