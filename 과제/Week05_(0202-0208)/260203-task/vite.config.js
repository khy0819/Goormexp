// 1. 반드시 vite에서 defineConfig를 import 해야 합니다!
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 아카이브 사이트 배포를 위해 base 경로를 설정합니다.
  base: './', 
  server: {
    port: 3000, // 과제 요구사항: 포트 3000
  }
})