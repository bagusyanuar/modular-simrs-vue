<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useMutation } from '@tanstack/vue-query';
import { ssoProvider } from '@genossys-hospital/infrastructure/sso/base/sso.provider';
import { SSOError } from '@neurovi-hospital/sdk-sso';

// 1. Capture OIDC Context from URL
const route = useRoute();
const oidcParams = computed(() => ({
  client_id: (route.query.client_id as string) || '',
  redirect_uri: (route.query.redirect_uri as string) || '',
  state: (route.query.state as string) || '',
  code_challenge: (route.query.code_challenge as string) || '',
  code_challenge_method: (route.query.code_challenge_method as string) || '',
  response_type: (route.query.response_type as string) || 'code',
}));

// 2. Validation Schema
const loginSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const schema = toTypedSchema(loginSchema);

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    password: '',
    remember: false,
  },
});

const [username, usernameProps] = defineField('username');
const [password, passwordProps] = defineField('password');
const [remember, rememberProps] = defineField('remember');

// 3. Login Mutation
const errorMessage = ref<string | null>(null);

const { mutate: login, isPending } = useMutation({
  mutationFn: async (values: LoginFormValues) => {
    errorMessage.value = null;
    return await ssoProvider.login({
      username: values.username,
      password: values.password,
      ...oidcParams.value,
    });
  },
  onSuccess: (session) => {
    console.log('[SSO] Login success:', session);

    // If it was an OIDC Authorize flow, the SDK would have already handled the code generation
    // but the actual redirect back to the client app happens here in the UI layer.
    const redirectUri = oidcParams.value.redirect_uri;
    if (redirectUri) {
      // In a real flow, we would redirect back with the code.
      // For now, let's just log and redirect if possible.
      // window.location.href = `${redirectUri}?code=...&state=${oidcParams.value.state}`;
      console.log('[SSO] Redirecting back to:', redirectUri);
    } else {
      // Internal redirect to dashboard if login was direct
      window.location.href = '/';
    }
  },
  onError: (error) => {
    if (error instanceof SSOError) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'Terjadi kesalahan sistem. Silakan coba lagi.';
    }
  },
});

const onSubmit = handleSubmit((values) => {
  login(values);
});
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
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div v-if="errorMessage" class="p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
          {{ errorMessage }}
        </div>

        <div class="space-y-2">
          <label
            class="text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300"
            for="username"
          >
            Username atau Email
          </label>
          <input
            id="username"
            v-model="username"
            v-bind="usernameProps"
            type="text"
            placeholder="nama@neurovi.id"
            :disabled="isPending"
            class="flex h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:ring-teal-500 dark:ring-offset-zinc-950 disabled:opacity-50"
            :class="{ 'border-red-500 focus:ring-red-500': errors.username }"
          />
          <p v-if="errors.username" class="text-xs text-red-500 font-medium">{{ errors.username }}</p>
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
            v-model="password"
            v-bind="passwordProps"
            type="password"
            placeholder="••••••••"
            :disabled="isPending"
            class="flex h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:ring-teal-500 dark:ring-offset-zinc-950 disabled:opacity-50"
            :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
          />
          <p v-if="errors.password" class="text-xs text-red-500 font-medium">{{ errors.password }}</p>
        </div>

        <div class="flex items-center space-x-3">
          <div class="relative flex items-center">
            <input
              id="remember"
              v-model="remember"
              v-bind="rememberProps"
              type="checkbox"
              :disabled="isPending"
              class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-zinc-300 bg-white checked:bg-teal-500 checked:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-teal-500 dark:checked:border-teal-500 disabled:opacity-50"
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
          type="submit"
          :disabled="isPending"
          class="inline-flex items-center justify-center rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-teal-600 text-white hover:bg-teal-700 h-12 px-8 w-full shadow-lg shadow-teal-600/20 active:scale-[0.98]"
        >
          <span v-if="isPending" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {{ isPending ? 'Memproses...' : 'Masuk Sekarang' }}
        </button>
      </form>

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
