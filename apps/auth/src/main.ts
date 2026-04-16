import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { SessionManager } from '@genrs/auth';

// 🔐 SSO Initialization
SessionManager.configure({
  domain: import.meta.env.VITE_AUTH_SSO_DOMAIN,
  authServerUrl: import.meta.env.VITE_AUTH_SERVER_URL,
  secure: import.meta.env.VITE_AUTH_SECURE_COOKIE === 'true',
});

console.log('[AuthMain] Initializing SSO Portal...');
const app = createApp(App);
app.use(appRouter);
app.mount('#app');
console.log('[AuthMain] SSO Portal Mounted.');
