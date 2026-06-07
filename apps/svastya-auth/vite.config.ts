import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const port = env.VITE_PORT ? parseInt(env.VITE_PORT, 10) : 5173;

  return {
    base: '/auth/',
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@genossys-hospital/presentation': path.resolve(
          __dirname,
          '../../modules/presentation/src'
        ),
      },
    },
    server: {
      https: {
        key: fs.readFileSync(
          path.resolve(
            __dirname,
            '../../.ssl/_wildcard.neurovi-svastya.local+1-key.pem'
          )
        ),
        cert: fs.readFileSync(
          path.resolve(
            __dirname,
            '../../.ssl/_wildcard.neurovi-svastya.local+1.pem'
          )
        ),
      },
      host: 'neurovi-svastya.local',
      port,
    },
  };
});
