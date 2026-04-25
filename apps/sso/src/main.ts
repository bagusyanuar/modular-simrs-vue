import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { SSOSessionManager } from '@genrs/sso';
import { getEnv } from '@genrs/utils';

// 🔐 Initialize SSO Session Configuration
SSOSessionManager.configure({
  domain: getEnv('VITE_SSO_DOMAIN'),
  secure: window.location.protocol === 'https:',
  expires: 7,
});

const app = createApp(App);
app.use(appRouter);
app.mount('#app');
