import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8001',
      '/image': 'http://localhost:8001',
    },
  },
  build: {
    outDir: '../backend_ai/frontend_dist',
    chunkSizeWarningLimit: 1000,
  },
})
