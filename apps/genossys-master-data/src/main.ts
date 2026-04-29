import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { SSOClient, createSSOGuard, type SSOConfig } from '@genossys-hospital/sso-sdk';
import { useAuthStore } from './stores/auth';

interface RuntimeConfig {
    VITE_SSO_BASE_URL?: string;
    VITE_SSO_CLIENT_ID?: string;
    VITE_SSO_PORTAL_URL?: string;
}

declare global {
    interface Window {
        config?: RuntimeConfig;
    }
}

const pinia = createPinia();

// 🔐 Initialize SSO Client
const auth = new SSOClient({
    baseUrl: window.config?.VITE_SSO_BASE_URL || import.meta.env.VITE_SSO_BASE_URL,
    portalUrl: window.config?.VITE_SSO_PORTAL_URL || `http://${import.meta.env.VITE_SSO_DOMAIN}:${import.meta.env.VITE_SSO_PORT}`,
    clientId: window.config?.VITE_SSO_CLIENT_ID || import.meta.env.VITE_SSO_CLIENT_ID,
    redirectUri: `${window.location.origin}/callback`,
    persistence: 'memory', // Access token in Pinia, Refresh token in HTTPOnly Cookie
});

// 🛡️ Setup SSO Guard
createSSOGuard(appRouter, {
    auth,
    onAuthenticated: async (session) => {
        const authStore = useAuthStore(pinia);
        authStore.setToken(session.accessToken);
        // await authStore.fetchProfile(); 
    },
    onAuthError: (err) => {
        console.error('❌ [MasterData] Auth Error:', err);
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
