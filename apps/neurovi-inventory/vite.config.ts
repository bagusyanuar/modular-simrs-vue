import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import fs from 'node:fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@genossys-hospital/presentation': path.resolve(__dirname, '../../modules/presentation/src'),
    },
  },
  base: '/v2/inventory/',
  server: {
    port: 5173,
    strictPort: true,
    host: 'neurovi-local.test',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../../ssl/neurovi-local.test-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../../ssl/neurovi-local.test.pem')),
    },
    origin: 'https://neurovi-local.test:5173',
  },
});
