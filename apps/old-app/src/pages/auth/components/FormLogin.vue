<script setup lang="ts">
import { NTextfield } from '@genrs/ui/components/ui/textfield';
import { NPasswordfield } from '@genrs/ui/components/ui/passwordfield';
import { NButton } from '@genrs/ui/components/ui/button';
import { NLabel } from '@genrs/ui/components/ui/label';
import { NIcon } from '@genrs/ui/components/icons';
import brandLogo from '../../../assets/logo-rs.png';
import { useLogin } from '../composables/useLogin';
import { NHelperText } from '@genrs/ui/components/ui/helper-text';
const {
  email,
  emailAttrs,
  password,
  passwordAttrs,
  errors,
  isSubmitting,
  onSubmit,
} = useLogin();
</script>
<template>
  <div class="bg-white w-full h-full flex flex-col p-8">
    <div class="">
      <div class="flex items-center gap-2 mb-3">
        <img :src="brandLogo" class="w-16 h16" alt="Brand Logo" />
        <h1 class="text-neutral-700 text-2xl font-bold">Neurovi Old App</h1>
      </div>
      <h1 class="text-neutral-500 text-lg font-semibold">Welcome back,</h1>
      <p class="text-neutral-500 text-sm">
        Please enter your credentials to login
      </p>
    </div>
    <div class="flex-1 flex flex-col justify-center gap-3">
      <div class="w-full">
        <NLabel size="sm">Email</NLabel>
        <NTextfield placeholder="Email" v-model="email" v-bind="emailAttrs">
          <template #prefix>
            <NIcon icon="lucide:mail" class="w-3.5" />
          </template>
        </NTextfield>
        <NHelperText :error="!!errors.email" size="sm">
          {{ errors.email }}
        </NHelperText>
      </div>
      <div class="w-full">
        <NLabel size="sm">Password</NLabel>
        <NPasswordfield
          placeholder="Password"
          v-model="password"
          v-bind="passwordAttrs"
        ></NPasswordfield>
        <NHelperText :error="!!errors.password" size="sm">
          {{ errors.password }}
        </NHelperText>
      </div>
      <div class="w-full mt-3">
        <NButton :loading="isSubmitting" class="w-full" @click="onSubmit"
          >Sign In to Old App</NButton
        >
      </div>
    </div>
    <div class="w-full flex items-center justify-between">
      <div class="flex text-neutral-500/70 text-xs">Neurovi Old App</div>
      <div class="flex items-center text-neutral-500/50 text-xs gap-2">
        <span>HELP</span>
        <span>|</span>
        <span>PRIVACY POLICY</span>
      </div>
    </div>
  </div>
</template>
