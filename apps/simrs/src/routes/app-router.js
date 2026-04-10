import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '../layouts/AppLayout.vue';
import { activeModules } from '@page/manifest';
import { moduleLibrary } from 'virtual:page-registry';
import { createSSOGuard } from '@genrs/auth';
function resolveRoutes() {
    const aggregatedRoutes = [];
    activeModules.forEach((moduleName) => {
        const moduleExports = moduleLibrary[moduleName];
        if (moduleExports) {
            moduleExports.forEach((exp) => {
                const routes = Object.values(exp)[0];
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
//# sourceMappingURL=app-router.js.map