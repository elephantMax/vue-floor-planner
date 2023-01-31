import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue-floor-planner',
  plugins: [vue()],
  server: {
    port: 3000,
  },
})
