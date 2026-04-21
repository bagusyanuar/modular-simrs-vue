import type { RouteRecordRaw } from 'vue-router';

/**
 * Route Resolver Utility
 * Aggregates routes from modular libraries and extra tenant-specific routes.
 * 
 * @param activeModules - List of active modules from the manifest
 * @param moduleLibrary - Registry of dynamic imports from virtual:page-registry
 * @returns Aggregated RouteRecordRaw array
 */
export function resolveRoutes(
  activeModules: { name: string; version: string }[],
  moduleLibrary: Record<string, Array<Record<string, RouteRecordRaw[]>>>
): RouteRecordRaw[] {
  const aggregatedRoutes: RouteRecordRaw[] = [];

  // Helper function to extract routes from module exports
  const extractRoutes = (exportsArray: Array<Record<string, RouteRecordRaw[]>>) => {
    exportsArray.forEach((exp) => {
      // exp is a Record where values are arrays of RouteRecordRaw
      Object.values(exp).forEach((routes) => {
        if (Array.isArray(routes)) {
          aggregatedRoutes.push(...routes);
        }
      });
    });
  };

  // 1. Process Global Tenant Extra Routes (HIGHEST PRIORITY)
  if (moduleLibrary['extra']) {
    try {
      extractRoutes(moduleLibrary['extra']);
    } catch (e) {
      console.error('[RouteResolver] Failed to load global extra routes', e);
    }
  }

  // 2. Process Standard Active Modules from Manifest
  activeModules.forEach((mod) => {
    try {
      const exports = moduleLibrary[mod.name];
      if (exports) {
        extractRoutes(exports);
      }
    } catch (e) {
      console.error(
        `[RouteResolver] Failed to load routes for module: ${mod.name}`,
        e
      );
    }
  });

  return aggregatedRoutes;
}
