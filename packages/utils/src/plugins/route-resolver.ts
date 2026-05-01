import fs from 'fs';
import path from 'path';

export interface RouteResolverOptions {
  tenant: string;
  appRoot: string; // Absolute path to the app directory
}

/**
 * Vite Plugin to dynamically resolve tenant routes.
 * Strict Mode: Only picks up routes from the current tenant folder (or base if no tenant).
 * No fallback to base to allow flexible route pickup per tenant.
 */
export function routeResolverPlugin(options: RouteResolverOptions) {
  const { tenant, appRoot } = options;
  const virtualId = 'virtual:tenant-routes';
  const resolvedId = '\0' + virtualId;

  return {
    name: 'genrs-route-resolver',
    resolveId: (id: string) => (id === virtualId ? resolvedId : null),
    load(id: string) {
      if (id !== resolvedId) return null;

      // 💡 Scan source directory based on current tenant
      const relativePath =
        tenant !== 'base' ? `src/routes/_tenants/${tenant}` : 'src/routes/base';

      const scanDir = path.resolve(appRoot, relativePath);

      const files = fs.existsSync(scanDir)
        ? fs.readdirSync(scanDir).filter((f) => f.endsWith('.routes.ts'))
        : [];

      const imports: string[] = [];
      const routeNames: string[] = [];

      files.forEach((file, i) => {
        const name = file.replace('.routes.ts', '');
        const varName = `r${i}`;

        // Direct path to the scanned file, no fallback logic
        const finalPath = `@/routes/${
          tenant !== 'base' ? `_tenants/${tenant}` : 'base'
        }/${name}.routes`;

        imports.push(
          `import { ${name}Routes as ${varName} } from '${finalPath}';`
        );
        routeNames.push(`...${varName}`);
      });

      return `${imports.join('\n')}\nexport const tenantRoutes = [${routeNames.join(', ')}];\nexport default tenantRoutes;`;
    },
  };
}
