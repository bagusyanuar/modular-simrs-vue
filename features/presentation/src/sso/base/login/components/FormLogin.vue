<script setup lang="ts">
import { NTextfield } from '@genrs/ui/components/ui/textfield';
import { NPasswordfield } from '@genrs/ui/components/ui/passwordfield';
import { NButton } from '@genrs/ui/components/ui/button';
import { NLabel } from '@genrs/ui/components/ui/label';
import { NIcon } from '@genrs/ui/components/icons';
import { NHelperText } from '@genrs/ui/components/ui/helper-text';
import { useAuthFlow } from '../composables/useAuthFlow';

const {
  email,
  emailAttrs,
  password,
  passwordAttrs,
  errors,
  loading,
  handleLogin,
} = useAuthFlow();
</script>

<template>
  <div class="bg-white w-full h-full flex flex-col p-8 md:p-12">
    <!-- Header Branded -->
    <div class="mb-10 text-center md:text-left">
      <div class="flex items-center gap-2 mb-4 justify-center md:justify-start">
        <div class="p-2 bg-teal-50 rounded-lg border border-teal-100 shadow-sm">
           <NIcon icon="lucide:hospital" class="text-teal-600 w-6 h-6" />
        </div>
        <h1 class="text-stone-900 text-2xl font-black tracking-tight uppercase italic">Neurovi</h1>
      </div>
      <h2 class="text-neutral-700 text-3xl font-bold tracking-tight">Welcome Back,</h2>
      <p class="text-neutral-500 text-sm mt-1">
        Masukkan kredensial Anda untuk mengakses SIMRS.
      </p>
    </div>

    <!-- Form Section -->
    <div class="flex-1 flex flex-col justify-center gap-5">
      <div class="w-full">
        <NLabel size="sm" class="mb-1.5 ml-1 font-bold text-stone-600">Email Address</NLabel>
        <NTextfield 
          placeholder="nama@email.com" 
          v-model="email" 
          v-bind="emailAttrs"
          :error="!!errors.email"
        >
          <template #prefix>
            <NIcon icon="lucide:mail" class="w-4 text-stone-400" />
          </template>
        </NTextfield>
        <NHelperText :error="!!errors.email" size="sm">
          {{ errors.email }}
        </NHelperText>
      </div>

      <div class="w-full">
        <div class="flex justify-between items-center mb-1.5 ml-1">
          <NLabel size="sm" class="font-bold text-stone-600">Password</NLabel>
          <a href="#" class="text-xs text-teal-600 font-bold hover:underline transition-all">Lupa Password?</a>
        </div>
        <NPasswordfield
          placeholder="••••••••"
          v-model="password"
          v-bind="passwordAttrs"
          :error="!!errors.password"
        >
          <template #prefix>
            <NIcon icon="lucide:lock" class="w-4 text-stone-400" />
          </template>
        </NPasswordfield>
        <NHelperText :error="!!errors.password" size="sm">
          {{ errors.password }}
        </NHelperText>
      </div>

      <div class="w-full mt-4">
        <NButton 
          :loading="loading" 
          class="w-full py-6 rounded-xl text-md font-bold shadow-lg shadow-teal-50 hover:shadow-teal-200 transition-all cursor-pointer" 
          @click="handleLogin"
        >
          Sign In ke Akun
        </NButton>
      </div>
    </div>

    <!-- Footer Branding -->
    <div class="mt-8 flex items-center justify-between text-[10px] text-stone-400 font-bold tracking-widest uppercase">
      <div>GENRS SSO PORTAL</div>
      <div class="flex items-center gap-3">
        <a href="#" class="hover:text-stone-600 transition-colors">HELP</a>
        <span class="opacity-30">|</span>
        <a href="#" class="hover:text-stone-600 transition-colors">PRIVACY POLICY</a>
      </div>
    </div>
  </div>
</template>
