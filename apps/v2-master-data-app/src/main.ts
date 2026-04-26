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
  redirectUri: `http://${getEnv('VITE_DOMAIN')}:${getEnv('VITE_PORT_MASTER_DATA_APP')}/callback`,
  portalUrl: `http://${getEnv('VITE_SSO_DOMAIN')}:${getEnv('VITE_SSO_PORT')}`,
  sessionConfig: {
    domain: (function () {
      const d = getEnv('VITE_SSO_COOKIE_DOMAIN');
      console.log('🔍 [MasterData] SSO Cookie Domain:', d);
      return d;
    })(),
    secure: true, // 🔒 Paksa true karena kita sudah pakai HTTPS
    persistentStorage: 'cookie', // 🍪 Refresh Token di Cookie (Shared)

    onSaveToken: (token) => {
      console.log('💾 [MasterData] Saving access token to localStorage');
      localStorage.setItem('sso_access_token', token);
    },
    onGetToken: () => localStorage.getItem('sso_access_token'),
    onClearToken: () => localStorage.removeItem('sso_access_token'),
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
