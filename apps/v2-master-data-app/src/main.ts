import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { createSSOGuard } from '@genrs/sso';
import { getEnv } from '@genrs/utils';

// 🔐 Setup SSO Guard
// 🔐 Setup SSO Guard
createSSOGuard(appRouter, {
  baseUrl: getEnv('VITE_SSO_BASE_URL'),
  clientId: getEnv('VITE_SSO_CLIENT_ID'),
  redirectUri: `http://${getEnv('VITE_DOMAIN')}:${getEnv('VITE_PORT_MASTER_DATA_APP')}/callback`,
  portalUrl: `http://${getEnv('VITE_SSO_DOMAIN')}:${getEnv('VITE_SSO_PORT')}`,
  sessionConfig: {
    domain: getEnv('VITE_SSO_COOKIE_DOMAIN'),
    secure: window.location.protocol === 'https:',
  },
  onAuthenticated: (session) => {
    console.log('🎉 Successfully authenticated in Master Data App!', session);
  },
});

const app = createApp(App);
app.use(appRouter);
app.mount('#app');
