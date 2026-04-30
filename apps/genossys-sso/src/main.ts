import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { getEnv } from '@genrs/utils';
import { SSOClient } from '@genossys-hospital/sso-sdk';

const app = createApp(App);

// 🔐 Initialize SSO Client
const auth = new SSOClient({
  baseUrl: getEnv('VITE_SSO_BASE_URL'),
  clientId: getEnv('VITE_SSO_CLIENT_ID'),
  redirectUri: getEnv('VITE_SSO_REDIRECT_URI'),
  persistence: 'memory',
});

// 🛡️ Reverse Guard: Redirect to app if already logged in
appRouter.beforeEach(async (to, _from, next) => {
  // Hanya jalankan logic redirect jika tidak sedang dalam flow OAuth2 (tidak ada client_id)
  if (!to.query.client_id && to.path !== '/callback') {
    const session = await auth.refreshAccessToken();
    if (session) {
      const redirectUri = getEnv('VITE_SSO_REDIRECT_URI');
      window.location.href = redirectUri.replace('/callback', '');
      return next(false);
    }
  }
  next();
});

app.use(appRouter);

// Wait for router to be ready to prevent flash of blank page
appRouter.isReady().then(() => {
  app.mount('#app');
});
