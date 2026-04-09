<script lang="ts" setup>
import { SessionManager } from '@genrs/auth';
import { useAuthFlow } from '../../composables/useAuthFlow';

const { email, password, loading, error, isAuthenticated, handleLogin } =
  useAuthFlow();

const logout = () => {
  SessionManager.logout();
  window.location.reload();
};
</script>

<template>
  <div
    class="w-full h-dvh bg-stone-100/50 flex items-center justify-center p-4"
  >
    <div
      class="w-full max-w-4xl h-full max-h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-stone-200/50"
    >
      <!-- Illustration Side (Wow Factor) -->
      <div
        class="hidden md:flex flex-col items-center justify-center bg-linear-to-br from-indigo-600 to-violet-700 p-12 text-white relative"
      >
        <div
          class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"
        ></div>
        <div class="relative z-10 text-center">
          <h1 class="text-4xl font-bold mb-4 tracking-tight">Neurovi SIMRS</h1>
          <p class="text-indigo-100 text-lg">
            Centralized Authentication Portal for Healthcare Ecosystem.
          </p>
        </div>
        <!-- Decorative Circle -->
        <div
          class="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50"
        ></div>
      </div>

      <!-- Form Side -->
      <div class="flex flex-col justify-center p-8 md:p-12">
        <!-- 🔄 Redirecting State -->
        <div
          v-if="isAuthenticated && $route.query.redirect_uri"
          class="text-center space-y-4"
        >
          <div
            class="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"
          ></div>
          <h2 class="text-2xl font-bold text-indigo-600">Redirecting...</h2>
          <p class="text-stone-500">
            Sedang menghubungkan Bosku kembali ke aplikasi.
          </p>
        </div>

        <!-- ✅ Already Logged In State (Manual Visit) -->
        <div
          v-else-if="isAuthenticated && !$route.query.redirect_uri"
          class="text-center space-y-6"
        >
          <div
            class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl"
          >
            ✓
          </div>
          <div>
            <h2 class="text-3xl font-bold text-stone-900">Bosku Sudah Login</h2>
            <p class="text-stone-500 mt-2">
              Anda sedang aktif di portal SSO GenRS.
            </p>
          </div>
          <div class="flex flex-col gap-3">
            <a
              href="http://neurovi-simulation.test:3000/simrs/"
              class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Ke Dashboard SIMRS
            </a>
            <button
              @click="logout"
              class="text-sm font-bold text-stone-400 hover:text-red-500 transition-colors"
            >
              Logout & Ganti Akun
            </button>
          </div>
        </div>

        <!-- 🔑 Login Form -->
        <template v-else>
          <div class="mb-10 text-center md:text-left">
            <h2 class="text-3xl font-bold text-stone-900 tracking-tight">
              Selamat Datang
            </h2>
            <p class="text-stone-500 mt-2">Silahkan masuk ke akun anda.</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Error Alert -->
            <div
              v-if="error"
              class="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 animate-in fade-in slide-in-from-top-2"
            >
              {{ error }}
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-stone-700 ml-1"
                >Email Address</label
              >
              <input
                v-model="email"
                type="email"
                placeholder="nama@email.com"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-hidden focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-stone-50/50 focus:bg-white placeholder:text-stone-400"
                required
              />
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center ml-1">
                <label class="text-sm font-semibold text-stone-700"
                  >Password</label
                >
                <a
                  href="#"
                  class="text-xs text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
                  >Lupa Password?</a
                >
              </div>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-hidden focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-stone-50/50 focus:bg-white placeholder:text-stone-400"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transform active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              <span
                v-if="loading"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></span>
              {{ loading ? 'Masuk...' : 'Masuk Sekarang' }}
            </button>
          </form>

          <p class="mt-8 text-center text-sm text-stone-500">
            Belum punya akun?
            <a href="#" class="text-indigo-600 font-bold hover:underline"
              >Hubungi IT Support</a
            >
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
