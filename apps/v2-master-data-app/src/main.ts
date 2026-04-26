import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { createSSOGuard } from '@genrs/sso';
import { getEnv } from '@genrs/utils';

// 🏁 [UI] Set initial loading context
const loaderText = document.getElementById('loader-text');
if (loaderText) loaderText.innerText = 'Preparing content...';

// 🔐 Setup SSO Guard
createSSOGuard(appRouter, {
  baseUrl: getEnv('VITE_SSO_BASE_URL'),
  clientId: getEnv('VITE_SSO_CLIENT_ID'),
  redirectUri: `${window.location.protocol}//${getEnv('VITE_DOMAIN')}:${getEnv('VITE_PORT_MASTER_DATA_APP')}/callback`,
  portalUrl: `${window.location.protocol}//${getEnv('VITE_SSO_DOMAIN')}:${getEnv('VITE_SSO_PORT')}`,
  endpoints: {
    authorize: '/authorize',
    login: '/authorize',
    token: '/token',
  },
  sessionConfig: {
    domain: (function () {
      const d = getEnv('VITE_SSO_COOKIE_DOMAIN');
      return d;
    })(),
    secure: window.location.protocol === 'https:', // true = production, false = development
    persistentStorage: 'cookie', // 🍪 Refresh Token di Cookie (Shared)

    onSaveToken: (token) => {
      console.log('💾 [MasterData] Saving access token to localStorage');
      localStorage.setItem('access_token', token);
    },
    onGetToken: () => localStorage.getItem('access_token'),
    onClearToken: () => localStorage.removeItem('access_token'),
    refreshKey: 'refresh_token',
  },
  onAuthenticated: (session) => {
    console.log('🎉 Successfully authenticated in Master Data App!', session);
  },
});

const app = createApp(App);
app.use(appRouter);
app.mount('#app');

// 🏁 [UI] Smoothly hide global loader
const loader = document.getElementById('global-loader');
if (loader) {
  loader.style.opacity = '0';
  setTimeout(() => {
    loader.style.visibility = 'hidden';
  }, 500);
}
