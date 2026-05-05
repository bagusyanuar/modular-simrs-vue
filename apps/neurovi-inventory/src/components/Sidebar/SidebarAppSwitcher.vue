<script setup lang="ts">
import { ref } from 'vue';
import { ChevronsUpDown, Check } from 'lucide-vue-next';
import type { Component } from 'vue';

interface AppInfo {
  name: string;
  description: string;
  icon: Component;
  color: string;
}

interface Props {
  apps: AppInfo[];
  currentAppName: string;
}

defineProps<Props>();

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="relative px-3 py-2">
    <button
      class="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50 ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-sm bg-white dark:bg-slate-900/50"
      @click="toggle"
    >
      <div
        v-for="app in apps.filter((a) => a.name === currentAppName)"
        :key="app.name"
        class="flex items-center gap-3 w-full"
      >
        <div
          :class="[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-md',
            app.color,
          ]"
        >
          <component :is="app.icon" class="h-5 w-5" />
        </div>
        <div class="flex flex-1 flex-col overflow-hidden">
          <span
            class="truncate text-sm font-bold text-slate-900 dark:text-white"
            >{{ app.name }}</span
          >
          <span class="truncate text-[10px] text-slate-500 font-medium">{{
            app.description
          }}</span>
        </div>
        <ChevronsUpDown class="h-4 w-4 text-slate-400" />
      </div>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute left-3 right-3 top-full z-50 mt-2 flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="px-2 py-1.5">
        <span
          class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
          >Pilih Modul</span
        >
      </div>

      <button
        v-for="app in apps"
        :key="app.name"
        class="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
      >
        <div
          :class="[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white shadow-sm',
            app.color,
          ]"
        >
          <component :is="app.icon" class="h-4 w-4" />
        </div>
        <div class="flex flex-1 flex-col overflow-hidden">
          <span
            class="truncate text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary"
            >{{ app.name }}</span
          >
        </div>
        <Check
          v-if="app.name === currentAppName"
          class="h-3 w-3 text-primary"
        />
      </button>
    </div>
  </div>
</template>
