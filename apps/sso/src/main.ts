import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { enforceGateway } from '@genrs/utils';

enforceGateway(
  Number(import.meta.env.VITE_PORT_V1) || 3000,
  import.meta.env.VITE_DOMAIN
);

createApp(App).mount('#app');
