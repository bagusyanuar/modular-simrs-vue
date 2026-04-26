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
      // 🛠️ Virtual Config Plugin for Dev Mode
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
        '@genrs/sso': path.resolve(__dirname, '../../packages/sso/src'),
        '@genrs/utils': path.resolve(__dirname, '../../packages/utils/src'),
        '@genrs/presentation': path.resolve(
          __dirname,
          '../../features/presentation/src'
        ),
      },
    },
    server: {
      host: process.env.VITE_DOMAIN,
      allowedHosts: [`.${process.env.VITE_DOMAIN}`],
      port: Number(process.env.VITE_PORT_MASTER_DATA_APP) || 5173,
      strictPort: true,
      open: false,
      proxy: {
        '/api/v1/sso': {
          target: 'http://localhost:8081',
          changeOrigin: true,
        },
      },
    },
  };
});
