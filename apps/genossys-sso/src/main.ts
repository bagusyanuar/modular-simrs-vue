import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import appRouter from './routes/app-router';

const app = createApp(App);
app.use(appRouter);

// Wait for router to be ready to prevent flash of blank page
appRouter.isReady().then(() => {
  app.mount('#app');
});
