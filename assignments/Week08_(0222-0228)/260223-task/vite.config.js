import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://54.180.25.65:3002',
        changeOrigin: true,
        // /api/memos → http://54.180.25.65:3002/api/memos 로 그대로 전달
      },
    },
  },
})
