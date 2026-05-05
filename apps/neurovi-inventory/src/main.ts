import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { setupAuthMiddleware } from './middleware/auth.middleware'

// Initialize Middleware
setupAuthMiddleware(router);

const app = createApp(App);
app.use(router);
app.mount('#app');
