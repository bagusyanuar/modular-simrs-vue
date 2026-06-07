import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const port = env.VITE_PORT ? parseInt(env.VITE_PORT, 10) : 5174;

  return {
    base: '/',
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@svastya-hospital/presentation': path.resolve(
          __dirname,
          '../../modules-svastya/presentation/src'
        ),
      },
    },
    server: {
      https: {
        key: fs.readFileSync(
          path.resolve(
            __dirname,
            '../../.ssl/_wildcard.neurovi-svastya.test+1-key.pem'
          )
        ),
        cert: fs.readFileSync(
          path.resolve(
            __dirname,
            '../../.ssl/_wildcard.neurovi-svastya.test+1.pem'
          )
        ),
      },
      host: 'neurovi-svastya.test',
      port,
      proxy: {
        '/auth': {
          target: 'https://neurovi-svastya.test:5173',
          changeOrigin: true,
          secure: false,
          bypass: (req, res) => {
            if (req.url === '/auth') {
              res.writeHead(301, { Location: '/auth/' });
              res.end();
              return false;
            }
          },
        },
      },
    },
  };
});
