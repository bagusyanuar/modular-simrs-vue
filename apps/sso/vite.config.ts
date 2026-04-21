import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { tenantResolver } from '../../features/presentation/vite-plugin-tenant';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const globalEnv = loadEnv(mode, path.resolve(__dirname, '../../'), 'VITE_');
  const appEnv = loadEnv(mode, process.cwd(), 'VITE_');
  Object.assign(process.env, globalEnv, appEnv);

  const tenant = process.env.VITE_TENANT || 'base';

  return {
    base: process.env.VITE_PATH_SSO + '/',
    envDir: path.resolve(__dirname, '../../'),
    plugins: [vue(), tailwindcss(), tenantResolver('auth', tenant)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@genrs/presentation': path.resolve(
          __dirname,
          '../../features/presentation/src'
        ),
      },
    },
    server: {
      host: process.env.VITE_DOMAIN,
      allowedHosts: [`.${process.env.VITE_DOMAIN}`],
      port: Number(process.env.VITE_PORT_SSO) || 3001,
      strictPort: true,
      open: false,
      proxy: {},
    },
  };
});
