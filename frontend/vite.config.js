import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// build 時 base 指向 GitHub Pages 專案路徑；dev 維持根路徑
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/musen-flower-shop/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 開發時將 /api 代理到 Spring Boot 後端，避免 CORS
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
}))
