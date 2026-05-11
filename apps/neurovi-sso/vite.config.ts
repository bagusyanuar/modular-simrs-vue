import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import fs from 'node:fs';

function tenantRoutesPlugin(tenant: string) {
  const virtualModuleId = 'virtual:tenant-routes';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'tenant-routes-plugin',
    resolveId(id: string) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const targetPath =
          tenant === 'base'
            ? '@/routes/base/auth.routes'
            : `@/routes/_tenants/${tenant}/auth.routes`;

        return `export { authRoutes as default } from '${targetPath}';`;
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const globalEnv = loadEnv(mode, path.resolve(__dirname, '../../'), 'VITE_');
  const appEnv = loadEnv(mode, process.cwd(), 'VITE_');
  Object.assign(process.env, globalEnv, appEnv);

  const tenant = process.env.VITE_TENANT || 'base';

  return {
    envDir: path.resolve(__dirname, '../../'),
    plugins: [
      vue(),
      tailwindcss(),
      tenantRoutesPlugin(tenant),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@genossys-hospital/presentation': path.resolve(__dirname, '../../modules/presentation/src'),
        '@genossys-hospital/infrastructure': path.resolve(__dirname, '../../modules/infrastructure/src'),
        '@neurovi-hospital/sdk-sso': path.resolve(__dirname, '../../packages/sdk-sso/src'),
        '@genossys-hospital/http-sdk': path.resolve(__dirname, '../../packages/http-sdk/src'),
        '@genrs/utils': path.resolve(__dirname, '../../packages/utils/src'),
        '@genrs/ui': path.resolve(__dirname, '../../packages/ui/src'),
      },
    },
    server: {
      host: 'sso.neurovi-local.test',
      port: 5174,
      strictPort: true,
      https: {
        key: fs.readFileSync(path.resolve(__dirname, '../../ssl/_wildcard.neurovi-local.test+1-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, '../../ssl/_wildcard.neurovi-local.test+1.pem')),
      },
    },
  };
});
