import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: 'finance.neurovi-simulation.test',
    port: 3002,
    strictPort: true,
    open: true,
  },
})
