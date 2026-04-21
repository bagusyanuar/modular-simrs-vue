import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';
import { enforceGateway } from '@genrs/utils';

enforceGateway(
  Number(import.meta.env.VITE_PORT_V1) || 3000,
  import.meta.env.VITE_DOMAIN
);

createApp(App).use(appRouter).mount('#app');
