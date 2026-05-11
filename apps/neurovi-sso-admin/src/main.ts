import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { createSSOGuard } from '@neurovi-hospital/sdk-sso';
import { ssoProvider } from '@genossys-hospital/infrastructure/sso/base/sso.provider';

// 1. Create SSO Guard using Provider from Infrastructure
createSSOGuard(appRouter, {
  auth: ssoProvider,
  onAuthenticated: (session) => {
    console.log('[App] Authenticated:', session.accessToken);
    // TODO: Send session to Pinia AuthStore
  },
  onSessionExpired: () => {
    console.warn('[App] Session expired. Redirecting to login...');
  },
});

const app = createApp(App);
app.use(VueQueryPlugin);
app.use(appRouter);
app.mount('#app');
