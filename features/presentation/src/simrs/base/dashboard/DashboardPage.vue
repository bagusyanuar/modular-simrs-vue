<script setup lang="ts">
import { SessionManager } from '@genrs/auth';

const onLogout = () => {
  const { authServerUrl, redirectUri } = SessionManager.config;
  
  // 1. Clear Local Session
  SessionManager.logout();
  
  // 2. Build Redirect URL with context
  const loginUrl = new URL(`${authServerUrl}/authorize`);
  if (redirectUri) {
    loginUrl.searchParams.set('redirect_uri', redirectUri);
  }

  // 3. Kick to Login Portal
  window.location.href = loginUrl.toString();
};
</script>

<template>
  <div class="p-8">
    <div
      class="flex items-center justify-between bg-white p-6 rounded-2xl shadow-xs border border-stone-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-stone-900">Dashboard SIMRS</h1>
        <p class="text-stone-500 text-sm mt-1">
          Selamat datang kembali di sistem operasional.
        </p>
      </div>

      <button
        @click="onLogout"
        class="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 border border-red-100"
      >
        <span class="text-lg">Logout</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  </div>
</template>
