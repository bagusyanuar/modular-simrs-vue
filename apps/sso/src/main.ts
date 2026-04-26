import { getEnv } from '@genrs/utils';

// 🚀 [ULTRA-FAST REDIRECT]
// Jika akses langsung ke root tanpa param, lempar ke Master Data SEGERA.
// Ini dilakukan sebelum Vue di-init untuk menghindari glitch visual.
const params = new URLSearchParams(window.location.search);
const isDirectAccess = !params.get('client_id') && !params.get('redirect_uri');

if (
  isDirectAccess &&
  (window.location.pathname === '/' || window.location.pathname === '/login')
) {
  const redirectUri = getEnv('VITE_SSO_REDIRECT_URI') || '';
  const masterDataUrl = redirectUri.split('/callback')[0] || '/';

  console.log('🏎️ [SSO-Main] Instant discovery redirect to:', masterDataUrl);
  window.location.replace(masterDataUrl);

  // Berhenti di sini, jangan lanjut load Vue
  throw new Error('Redirecting to Master Data...');
}

import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';

// 🔐 App SSO Portal tidak butuh SSOGuard karena dia adalah Providernya.
// Dia cukup pakai Session Manager internal jika ingin cek login.
import { SSOSessionManager } from '@genrs/sso';

SSOSessionManager.configure({
  domain: getEnv('VITE_SSO_COOKIE_DOMAIN'),
  secure: window.location.protocol === 'https:',
  expires: 7,
  refreshKey: 'refresh_token',
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
