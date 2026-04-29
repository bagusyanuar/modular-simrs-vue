import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SSOUser } from '@genossys-hospital/sso-sdk';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const user = ref<SSOUser | null>(null);

  function setToken(token: string) {
    accessToken.value = token;
  }

  function setUser(userData: SSOUser) {
    user.value = userData;
  }

  function clearAuth() {
    accessToken.value = null;
    user.value = null;
  }

  return {
    accessToken,
    user,
    setToken,
    setUser,
    clearAuth,
  };
});
