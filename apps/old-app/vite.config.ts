import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const globalEnv = loadEnv(mode, path.resolve(__dirname, '../../'), 'VITE_');
  const appEnv = loadEnv(mode, process.cwd(), 'VITE_');

  // Merge (Lokal menimpa Global jika ada konflik)
  Object.assign(process.env, globalEnv, appEnv);

  return {
    base: process.env.VITE_PATH_V1 || '/',
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: 'neurovi-simulation.test',
      port: 3000,
      strictPort: true,
      open: true,
      proxy: {
        [process.env.VITE_PATH_SSO || '/sso']: {
          target: 'http://localhost:3002',
          changeOrigin: true,
        },
        [process.env.VITE_PATH_V2 || '/v2']: {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => (path === process.env.VITE_PATH_V2 ? process.env.VITE_PATH_V2 + '/' : path),
        },
      },
    },
  };
});
