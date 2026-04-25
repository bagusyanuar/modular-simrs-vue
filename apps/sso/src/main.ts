import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { createSSOGuard } from '@genrs/sso';
import { getEnv } from '@genrs/utils';

// 🔐 App SSO Portal tidak butuh SSOGuard karena dia adalah Providernya.
// Dia cukup pakai Session Manager internal jika ingin cek login.
import { SSOSessionManager } from '@genrs/sso';

SSOSessionManager.configure({
  domain: getEnv('VITE_SSO_COOKIE_DOMAIN'),
  secure: window.location.protocol === 'https:',
  expires: 7,
});

const app = createApp(App);
app.use(appRouter);
app.mount('#app');
