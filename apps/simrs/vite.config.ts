import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { tenantResolver } from '../../features/presentation/vite-plugin-tenant'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const tenant = env.VITE_TENANT || 'base'

  return {
    plugins: [
      vue(),
      tailwindcss(),
      tenantResolver(tenant),
    ],
  }
})
