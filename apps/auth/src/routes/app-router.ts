import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { activeModules } from '@page/manifest';
import { moduleLibrary } from 'virtual:page-registry';

function resolveRoutes(): RouteRecordRaw[] {
  const aggregatedRoutes: RouteRecordRaw[] = [];

  activeModules.forEach((mod) => {
    const moduleExports = moduleLibrary[mod.name];
    if (moduleExports) {
      moduleExports.forEach((exp: any) => {
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: resolveRoutes(),
});

export default appRouter;
