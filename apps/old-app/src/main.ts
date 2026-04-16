import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import './style.css';
import App from './App.vue';
import router from '@/router/app-router';
import { SessionManager, createSSOGuard } from '@genrs/auth';

// 🔐 SSO Initialization
SessionManager.configure({
  domain: import.meta.env.VITE_AUTH_SSO_DOMAIN,
  authServerUrl: import.meta.env.VITE_AUTH_SERVER_URL,
  secure: import.meta.env.VITE_AUTH_SECURE_COOKIE === 'true'
});

const app = createApp(App);

// 🛡️ Register SSO Guard
createSSOGuard(router);

app.use(VueQueryPlugin);
app.use(router);
app.mount('#app');
