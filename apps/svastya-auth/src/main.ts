import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './routers';

console.log('Runtime Env (window.config):', window.config);

const app = createApp(App);
app.use(router);
app.mount('#app');
