import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { SessionManager } from '@genrs/auth';

// 🔐 SSO Initialization
SessionManager.configure({
  domain: import.meta.env.VITE_AUTH_SSO_DOMAIN,
  secure: import.meta.env.VITE_AUTH_SECURE_COOKIE === 'true'
});

const app = createApp(App);
app.use(appRouter);
app.mount('#app');
