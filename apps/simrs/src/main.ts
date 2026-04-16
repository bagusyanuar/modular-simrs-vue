import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { SessionManager, createSSOGuard } from '@genrs/auth';

// 🔐 SSO Initialization
SessionManager.configure({
  domain: import.meta.env.VITE_AUTH_SSO_DOMAIN,
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
  redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI,
  authServerUrl: import.meta.env.VITE_AUTH_SERVER_URL,
  secure: import.meta.env.VITE_AUTH_SECURE_COOKIE === 'true'
});

console.log('🌍 Environment Check:', {
  globalName: import.meta.env.VITE_GLOBAL_APP_NAME,
  tenant: import.meta.env.VITE_TENANT,
  ssoDomain: SessionManager.config.domain
});

const app = createApp(App);

// 🛡️ Register SSO Guard
createSSOGuard(appRouter);

app.use(appRouter);
app.mount('#app');
