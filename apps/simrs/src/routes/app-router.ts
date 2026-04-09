import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AppLayout from '../layouts/AppLayout.vue';
import { activeModules } from '@page/manifest';
import { moduleLibrary } from 'virtual:page-registry';

function resolveRoutes(): RouteRecordRaw[] {
  const aggregatedRoutes: RouteRecordRaw[] = [];

  activeModules.forEach((moduleName) => {
    const moduleExports = moduleLibrary[moduleName];
    if (moduleExports) {
      moduleExports.forEach((exp: Record<string, unknown>) => {
        const routes = Object.values(exp)[0] as RouteRecordRaw[];
        if (Array.isArray(routes)) {
          aggregatedRoutes.push(...routes);
        }
      });
    }
  });

  return aggregatedRoutes;
}

const appRouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      component: AppLayout,
      path: '/',
      children: resolveRoutes(),
    },
  ],
});

export default appRouter;
