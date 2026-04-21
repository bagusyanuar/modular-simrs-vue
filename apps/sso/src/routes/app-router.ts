import { createRouter, createWebHistory } from 'vue-router';
import { activeModules } from '@page/manifest';
import { moduleLibrary } from 'virtual:page-registry';
import { resolveRoutes } from '@genrs/presentation/utils';

const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: resolveRoutes(activeModules, moduleLibrary),
});

export default appRouter;
