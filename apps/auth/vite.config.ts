import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load Global & Local Env
  const globalEnv = loadEnv(mode, path.resolve(__dirname, '../../'), 'VITE_');
  const appEnv = loadEnv(mode, process.cwd(), 'VITE_');
  Object.assign(process.env, globalEnv, appEnv);

  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@genrs/core': path.resolve(__dirname, '../../features/core/src'),
        '@genrs/infrastructure': path.resolve(__dirname, '../../features/infrastructure/src'),
        '@genrs/presentation': path.resolve(__dirname, '../../features/presentation/src'),
        '@genrs/auth': path.resolve(__dirname, '../../packages/auth/src'),
      },
    },
    server: {
      host: 'auth.neurovi-simulation.test',
      port: 3000,
      strictPort: true,
      open: true,
    },
  };
});
