import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import './style.css';
import App from './App.vue';
import router from './router';
import { setupAuthMiddleware } from './middleware/auth.middleware';

// Initialize Middleware
// setupAuthMiddleware(router);

const app = createApp(App);
app.use(VueQueryPlugin);
app.use(router);
app.mount('#app');
