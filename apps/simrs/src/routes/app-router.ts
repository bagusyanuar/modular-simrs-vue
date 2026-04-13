import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AppLayout from '../layouts/AppLayout.vue';
import { activeModules } from '@page/manifest';
import { moduleLibrary } from 'virtual:page-registry';
import { createSSOGuard } from '@genrs/auth';

function resolveRoutes(): RouteRecordRaw[] {
  const aggregatedRoutes: RouteRecordRaw[] = [];

  // 1. Process Standard Active Modules from Manifest
  activeModules.forEach((mod) => {
    try {
      const moduleExports = moduleLibrary[mod.name];
      if (moduleExports) {
        moduleExports.forEach((exp: any) => {
          // Find the exported array (this is our routes)
          const routes = Object.values(exp).find((v) => Array.isArray(v)) as RouteRecordRaw[];
          if (routes) {
            aggregatedRoutes.push(...routes);
          }
        });
      }
    } catch (e) {
      console.error(`[AppRouter] Failed to load routes for module: ${mod.name}`, e);
    }
  });

  // 2. Process Global Tenant Extra Routes (Automatically detected by plugin)
  if (moduleLibrary['extra']) {
    try {
      moduleLibrary['extra'].forEach((exp: any) => {
        const routes = Object.values(exp).find((v) => Array.isArray(v)) as RouteRecordRaw[];
        if (routes) {
          aggregatedRoutes.push(...routes);
        }
      });
    } catch (e) {
      console.error('[AppRouter] Failed to load global extra routes', e);
    }
  }

  return aggregatedRoutes;
}

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: AppLayout,
      path: '/',
      children: resolveRoutes(),
    },
    {
      path: '/callback',
      component: () => import('../App.vue'),
    },
  ],
});

// 🔐 Inject Centralized SSO Guard
createSSOGuard(appRouter);

export default appRouter;
