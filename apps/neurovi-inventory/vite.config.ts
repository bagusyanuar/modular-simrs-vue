import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

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
  base: '/v2/',
  server: {
    port: 5173,
    strictPort: true,
    host: true, // Menjalankan di 0.0.0.0 agar bisa diakses via 127.0.0.1 dari proxy
    origin: 'http://localhost:8080', // Membantu masalah CORS/HMR saat di-proxy
  },
});
