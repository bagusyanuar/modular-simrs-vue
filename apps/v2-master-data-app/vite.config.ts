import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const globalEnv = loadEnv(mode, path.resolve(__dirname, '../../'), 'VITE_');
  const appEnv = loadEnv(mode, process.cwd(), 'VITE_');
  Object.assign(process.env, globalEnv, appEnv);

  return {
    base: process.env.VITE_PATH_V2_MASTER_DATA || '/v2/master-data/',
    envDir: path.resolve(__dirname, '../../'),
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: process.env.VITE_DOMAIN,
      allowedHosts: [`.${process.env.VITE_DOMAIN}`],
      port: Number(process.env.VITE_PORT_V2_MASTER_DATA) || 3003,
      strictPort: true,
      open: false,
      proxy: {},
    },
  };
});
