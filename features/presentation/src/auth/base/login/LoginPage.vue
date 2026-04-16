<script setup lang="ts">
import { SessionManager } from '@genrs/auth';
import { useAuthFlow } from './composables/useAuthFlow';
import IllustrationPanel from './components/IllustrationPanel.vue';
import FormLogin from './components/FormLogin.vue';

const { isAuthenticated } = useAuthFlow();

const logout = () => {
  SessionManager.logout();
  window.location.reload();
};

const dashboardUrl = '/dashboard';
</script>

<template>
  <div class="w-full h-dvh bg-stone-100 flex items-center justify-center p-4 selection:bg-teal-100">
    <div
      class="w-full max-w-4xl h-full max-h-[600px] bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-stone-200/50"
    >
      <!-- Canvas Kiri: Illustration -->
      <IllustrationPanel />

      <!-- Canvas Kanan: Auth Interface -->
      <div class="relative flex flex-col justify-center bg-white shadow-[-1px_0_0_0_rgba(0,0,0,0.05)]">
        
        <!-- 🔄 State: Redirecting -->
        <div
          v-if="isAuthenticated && $route.query.return_url"
          class="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center space-y-4 animate-in fade-in zoom-in duration-300"
        >
          <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 class="text-2xl font-bold text-teal-600 tracking-tight">Redirecting...</h2>
          <p class="text-stone-500 font-medium">Menghubungkan Bosku kembali ke aplikasi.</p>
        </div>

        <!-- ✅ State: Authenticated (Manual Visit) -->
        <div
          v-else-if="isAuthenticated && !$route.query.return_url"
          class="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
           <div class="w-24 h-24 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-4xl shadow-inner animate-bounce-soft">
            ✓
          </div>
          <div>
            <h2 class="text-3xl font-black text-stone-900 tracking-tighter">BOSKU SUDAH LOGIN</h2>
            <p class="text-stone-500 mt-2 font-medium">Sesi Anda sedang aktif di Portal SSO.</p>
          </div>
          <div class="flex flex-col gap-4 w-full max-w-xs">
            <a
              :href="dashboardUrl"
              class="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 hover:shadow-teal-200 active:scale-[0.98] flex items-center justify-center"
            >
              Ke Dashboard Utama
            </a>
            <button
              @click="logout"
              class="text-xs font-bold text-stone-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em] cursor-pointer"
            >
              Sign Out & Ganti Akun
            </button>
          </div>
        </div>

        <!-- 🔑 State: Login Form -->
        <FormLogin v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-bounce-soft {
  animation: bounce-soft 3s ease-in-out infinite;
}
</style>
