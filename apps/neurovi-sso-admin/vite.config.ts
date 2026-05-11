import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import fs from 'node:fs';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const globalEnv = loadEnv(mode, path.resolve(__dirname, '../../'), 'VITE_');
  const appEnv = loadEnv(mode, process.cwd(), 'VITE_');
  Object.assign(process.env, globalEnv, appEnv);

  return {
    envDir: path.resolve(__dirname, '../../'),
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@genossys-hospital/presentation': path.resolve(
          __dirname,
          '../../modules/presentation/src'
        ),
        '@genrs/ui': path.resolve(__dirname, '../../packages/ui/src'),
      },
    },
    server: {
      host: 'sso-admin.neurovi-local.test',
      port: 5175,
      strictPort: true,
      https: {
        key: fs.readFileSync(
          path.resolve(__dirname, '../../ssl/_wildcard.neurovi-local.test+1-key.pem')
        ),
        cert: fs.readFileSync(
          path.resolve(__dirname, '../../ssl/_wildcard.neurovi-local.test+1.pem')
        ),
      },
    },
  };
});
