<script setup lang="ts">
import { ref } from 'vue';
import { User, LogOut, Settings, UserCircle, ChevronsUpDown } from 'lucide-vue-next';

interface UserInfo {
  name: string;
  role: string;
}

defineProps<{
  user: UserInfo;
}>();

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = `${import.meta.env.VITE_V1_APP_URL}/login`;
};
</script>

<template>
  <div class="relative">
    <!-- Trigger -->
    <button
      @click="toggle"
      class="flex w-full items-center gap-3 rounded-xl border border-slate-200/50 bg-slate-100/50 p-3 transition-all hover:bg-slate-200/50 dark:border-slate-700/50 dark:bg-slate-800/30 dark:hover:bg-slate-800/60"
    >
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/20">
        <User class="h-5 w-5 text-primary" />
      </div>
      <div class="flex flex-1 flex-col overflow-hidden text-left">
        <span class="truncate text-sm font-bold text-slate-900 dark:text-white">{{ user.name }}</span>
        <span class="truncate text-[10px] font-medium uppercase tracking-wider text-slate-500">{{ user.role }}</span>
      </div>
      <ChevronsUpDown class="h-4 w-4 text-slate-400" />
    </button>

    <!-- Popover Menu -->
    <div
      v-if="isOpen"
      class="absolute bottom-full left-0 right-0 z-50 mb-2 flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="px-2 py-2 border-bottom border-slate-100 dark:border-slate-800">
        <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Akun Anda</p>
      </div>

      <button class="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
        <UserCircle class="h-4 w-4 text-slate-400 group-hover:text-primary" />
        <span class="font-medium text-slate-700 dark:text-slate-200">Lihat Profil</span>
      </button>

      <button class="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
        <Settings class="h-4 w-4 text-slate-400 group-hover:text-primary" />
        <span class="font-medium text-slate-700 dark:text-slate-200">Pengaturan</span>
      </button>

      <div class="my-1 border-t border-slate-100 dark:border-slate-800" />

      <button 
        @click="handleLogout"
        class="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm text-red-600 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 group"
      >
        <LogOut class="h-4 w-4 text-red-500" />
        <span class="font-bold">Keluar Sistem</span>
      </button>
    </div>
  </div>
</template>
