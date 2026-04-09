import { createRouter, createWebHistory } from 'vue-router';

const appRouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: (to) => ({ path: '/authorize', query: to.query }),
    },
    {
      path: '/authorize',
      component: () =>
        import('@genrs/presentation/auth/base/pages/login/LoginPage.vue'),
    },
  ],
});

export default appRouter;
