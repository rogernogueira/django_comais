import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // react-fast-marquee (CJS) pode puxar uma segunda cópia do React → "Invalid hook call"
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react-fast-marquee'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
      '/admin': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
    },
  },
})
