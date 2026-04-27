import { defineStore } from 'pinia';

/**
 * Auth Store for Master Data App
 * Handles reactive Access Token state
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    /**
     * Update access token in state
     */
    setToken(token: string | null) {
      this.accessToken = token;
    },

    /**
     * Clear auth state
     */
    clearToken() {
      this.accessToken = null;
    },
  },
});
