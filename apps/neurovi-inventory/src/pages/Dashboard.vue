<script setup lang="ts"></script>

<template>
  <div class="p-8">
    <header class="mb-8">
      <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        Dashboard Overview
      </h1>
      <p class="text-slate-500 dark:text-slate-400 font-medium">
        Welcome back, here's what's happening with your inventory today.
      </p>
    </header>

    <!-- Dashboard Content -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-40 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6 flex flex-col justify-between group hover:border-primary/50 transition-colors">
        <div>
          <div class="h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded mb-2" />
          <div class="h-3 w-16 bg-slate-50 dark:bg-slate-800/50 rounded" />
        </div>
        <div class="flex items-end justify-between">
          <div class="h-10 w-20 bg-primary/10 rounded-lg animate-pulse" />
          <div class="h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>

    <!-- Additional Section -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6">
        <h2 class="font-bold text-slate-900 dark:text-white mb-4">Stock Trends</h2>
        <div class="w-full h-40 bg-slate-50 dark:bg-slate-800/30 rounded-xl" />
      </div>
      <div class="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6">
        <h2 class="font-bold text-slate-900 dark:text-white mb-4">Recent Activities</h2>
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div class="flex-1 space-y-2">
              <div class="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded" />
              <div class="h-2 w-2/3 bg-slate-50 dark:bg-slate-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
