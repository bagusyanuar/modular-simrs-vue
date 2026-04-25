import { h } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { dashboardRoutes } from './base/dashboard.routes';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...dashboardRoutes,
    {
      path: '/callback',
      component: { 
        render: () => h('div', { 
          class: 'flex items-center justify-center min-h-screen font-sans text-slate-600 bg-slate-50' 
        }, 'Authenticating... Bosku')
      },
      meta: { public: true },
    },
  ],
});

export default appRouter;
