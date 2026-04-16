import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { tenantResolver } from '../../features/presentation/vite-plugin-tenant';
import path from 'path';

export default defineConfig(({ mode }) => {
  const globalEnv = loadEnv(mode, path.resolve(__dirname, '../../'), 'VITE_');
  const appEnv = loadEnv(mode, process.cwd(), 'VITE_');
  Object.assign(process.env, globalEnv, appEnv);

  return {
    base: process.env.VITE_PATH_SSO + '/',
    plugins: [vue(), tailwindcss(), tenantResolver('auth', 'base')],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@genrs/core': path.resolve(__dirname, '../../features/core/src'),
        '@genrs/infrastructure': path.resolve(
          __dirname,
          '../../features/infrastructure/src'
        ),
        '@genrs/presentation': path.resolve(
          __dirname,
          '../../features/presentation/src'
        ),
        '@genrs/auth': path.resolve(__dirname, '../../packages/auth/src'),
      },
    },
    server: {
      host: 'neurovi-simulation.test',
      port: 3002,
      strictPort: true,
      open: true,
      proxy: {
        [process.env.VITE_PATH_V2 || '/v2']: {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/finance': {
          target: 'http://localhost:3002',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  };
});
