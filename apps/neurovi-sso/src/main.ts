import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';

const app = createApp(App);
app.use(VueQueryPlugin);
app.use(appRouter);
app.mount('#app');
