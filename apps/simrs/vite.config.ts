import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { tenantResolver } from '../../features/presentation/vite-plugin-tenant';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /**
   * Environment Merging Strategy
   * 1. Load dari Monorepo Root (Global)
   * 2. Load dari Folder App (Tenant Specific)
   * 3. Merge ke process.env agar tersedia di import.meta.env
   */
  const globalEnv = loadEnv(mode, path.resolve(__dirname, '../../'), 'VITE_');
  const appEnv = loadEnv(mode, process.cwd(), 'VITE_');

  // Merge (Lokal menimpa Global jika ada konflik)
  Object.assign(process.env, globalEnv, appEnv);

  const tenant = process.env.VITE_TENANT || 'base';

  return {
    base: process.env.VITE_PATH_V2 + '/',
    envDir: path.resolve(__dirname, '../../'),
    plugins: [vue(), tailwindcss(), tenantResolver('simrs', tenant)],
    server: {
      host: 'neurovi-simulation.test',
      allowedHosts: ['.neurovi-simulation.test'],
      port: 3001,
      strictPort: true,
    },
  };
});
