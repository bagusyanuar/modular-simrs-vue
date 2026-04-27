import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { createSSOGuard } from '@genrs/sso';
import { getEnv } from '@genrs/utils';
import { useAuthStore } from './stores/auth';

// 🏁 [UI] Set initial loading context
const loaderText = document.getElementById('loader-text');
if (loaderText) loaderText.innerText = 'Preparing content...';

// 🍍 Initialize Pinia early
const pinia = createPinia();

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
    domain: getEnv('VITE_SSO_COOKIE_DOMAIN'),
    secure: window.location.protocol === 'https:',
    persistentStorage: 'cookie',

    // 🔗 Link to Pinia Store
    onSaveToken: (token) => {
      console.log('💾 [MasterData] Saving access token to Pinia');
      const authStore = useAuthStore(pinia); // Pass pinia instance if called outside setup
      authStore.setToken(token);
    },
    onGetToken: () => {
      const authStore = useAuthStore(pinia);
      return authStore.accessToken;
    },
    onClearToken: () => {
      const authStore = useAuthStore(pinia);
      authStore.clearToken();
    },
    refreshKey: 'refresh_token',
  },
  onAuthenticated: (session) => {
    console.log('🎉 Successfully authenticated in Master Data App!', session);
  },
});

const app = createApp(App);
app.use(pinia);
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
