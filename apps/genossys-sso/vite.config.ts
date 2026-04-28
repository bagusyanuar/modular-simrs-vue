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
    envDir: path.resolve(__dirname, '../../'),
    plugins: [
      vue(),
      tailwindcss(),
      {
        name: 'virtual-config',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/config.js') {
              res.setHeader('Content-Type', 'application/javascript');
              res.end('window.config = {};');
              return;
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@genossys-hospital/presentation': path.resolve(
          __dirname,
          '../../modules/presentation/src'
        ),
      },
    },
    server: {
      host: process.env.VITE_SSO_DOMAIN,
      allowedHosts: [`.${process.env.VITE_SSO_DOMAIN}`],
      port: Number(process.env.VITE_SSO_PORT) || 5174,
      strictPort: true,
      open: false,
    },
  };
});
