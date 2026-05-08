<script setup lang="ts">
// Slicing Only - No Logic
</script>

<template>
  <!-- Login Form Side -->
  <div class="flex items-center justify-center p-8 bg-white dark:bg-zinc-950">
    <div class="w-full max-w-[400px] space-y-10">
      <!-- Header -->
      <div class="space-y-3 text-center lg:text-left">
        <h1
          class="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Masuk
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400">
          Masukkan kredensial Anda untuk mengakses portal modular SIMRS.
        </p>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <div class="space-y-2">
          <label
            class="text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300"
            for="username"
          >
            Username atau Email
          </label>
          <input
            id="username"
            type="text"
            placeholder="nama@neurovi.id"
            class="flex h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:ring-teal-500 dark:ring-offset-zinc-950"
          />
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label
              class="text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300"
              for="password"
            >
              Kata Sandi
            </label>
            <a
              href="#"
              class="text-xs font-bold text-teal-600 hover:text-teal-500 transition-colors"
            >
              Lupa sandi?
            </a>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            class="flex h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:ring-teal-500 dark:ring-offset-zinc-950"
          />
        </div>

        <div class="flex items-center space-x-3">
          <div class="relative flex items-center">
            <input
              id="remember"
              type="checkbox"
              class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-zinc-300 bg-white checked:bg-teal-500 checked:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-teal-500 dark:checked:border-teal-500"
            />
            <svg
              class="absolute left-1 top-1 h-3 w-3 pointer-events-none text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <label
            for="remember"
            class="text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
          >
            Ingat saya di perangkat ini
          </label>
        </div>

        <button
          class="inline-flex items-center justify-center rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-teal-600 text-white hover:bg-teal-700 h-12 px-8 w-full shadow-lg shadow-teal-600/20 active:scale-[0.98]"
        >
          Masuk Sekarang
        </button>
      </div>

      <p class="text-center text-xs text-zinc-500 leading-relaxed">
        Sistem ini hanya dapat diakses oleh personel medis yang terdaftar.<br />
        Masalah akses?
        <a
          href="#"
          class="font-bold underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-50"
          >Hubungi IT Support</a
        >.
      </p>
    </div>
  </div>
</template>
