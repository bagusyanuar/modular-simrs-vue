import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { SSOClient, createSSOGuard } from '@genossys-hospital/sdk-sso';

// 1. Initialize SSO Client
const ssoClient = new SSOClient({
  baseUrl: import.meta.env.VITE_SSO_BASE_URL,
  clientId: import.meta.env.VITE_SSO_CLIENT_ID,
  redirectUri: window.location.origin + '/callback',
});

// 2. Create SSO Guard
createSSOGuard(appRouter, {
  auth: ssoClient,
  onAuthenticated: (session) => {
    console.log('[App] Authenticated:', session.accessToken);
  },
});

const app = createApp(App);
app.use(appRouter);
app.mount('#app');
