<script setup lang="ts">
import { ref } from 'vue';

const email = ref<string>('');
const password = ref<string>('');
const isSubmitting = ref<boolean>(false);
const errorMsg = ref<string>('');
const showPassword = ref<boolean>(false);

const togglePassword = (): void => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async (e: Event): Promise<void> => {
  e.preventDefault();
  
  if (!email.value || !password.value) {
    errorMsg.value = 'Email dan password wajib diisi.';
    return;
  }

  errorMsg.value = '';
  isSubmitting.value = true;

  try {
    // Simulasikan request API login
    await new Promise((resolve) => setTimeout(resolve, 1500));
    window.location.href = '/';
  } catch (err: unknown) {
    errorMsg.value = 'Kredensial salah atau terjadi gangguan server.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
    <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] border border-slate-100">
      
      <!-- Left: Brand & Illustration Panel (Hidden on mobile) -->
      <div class="hidden md:flex md:col-span-5 bg-gradient-to-tr from-emerald-600 to-teal-500 p-8 flex-col justify-between text-white relative overflow-hidden">
        <!-- Background Pattern Decorator -->
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div class="relative z-10 flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <span class="font-bold tracking-wider uppercase text-sm">Svastya SIMRS</span>
        </div>

        <div class="relative z-10 my-auto space-y-4">
          <h2 class="text-3xl font-extrabold leading-tight">Solusi Digitalisasi Layanan Kesehatan Anda</h2>
          <p class="text-emerald-100/90 text-sm leading-relaxed">
            Sistem Informasi Manajemen Rumah Sakit terintegrasi untuk meningkatkan efisiensi, akurasi, dan kualitas pelayanan pasien.
          </p>
        </div>

        <div class="relative z-10 text-xs text-emerald-200">
          &copy; 2026 Svastya Hospital Group. All rights reserved.
        </div>
      </div>

      <!-- Right: Login Form -->
      <div class="col-span-1 md:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
        <div class="my-auto max-w-md w-full mx-auto space-y-8">
          
          <!-- Heading -->
          <div>
            <h3 class="text-2xl font-bold text-slate-800 tracking-tight">Selamat Datang Kembali</h3>
            <p class="text-sm text-slate-500 mt-1">Silakan masukkan akun Anda untuk masuk ke sistem.</p>
          </div>

          <!-- Alert Error -->
          <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{{ errorMsg }}</span>
          </div>

          <!-- Form -->
          <form @submit="handleSubmit" class="space-y-5">
            
            <!-- Email Field -->
            <div class="space-y-1.5">
              <label for="email" class="text-xs font-bold text-slate-700">Alamat Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  v-model="email"
                  required
                  placeholder="name@svastya.com"
                  class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-1.5">
              <div class="flex justify-between items-center">
                <label for="password" class="text-xs font-bold text-slate-700">Kata Sandi</label>
                <a href="#" class="text-xs text-emerald-600 font-semibold hover:underline">Lupa password?</a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  required
                  placeholder="••••••••"
                  class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  @click="togglePassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Memproses...' : 'Sign In' }}</span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center text-xs text-slate-400 font-medium">
          Butuh Bantuan? Hubungi <a href="#" class="text-emerald-600 hover:underline">IT Support SIMRS</a>
        </div>
      </div>

    </div>
  </div>
</template>
