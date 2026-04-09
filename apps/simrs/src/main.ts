import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';

console.log('🌍 Environment Check:', {
  globalName: import.meta.env.VITE_GLOBAL_APP_NAME,
  tenant: import.meta.env.VITE_TENANT
});

const app = createApp(App);
app.use(appRouter);
app.mount('#app');
