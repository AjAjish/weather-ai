import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/weather': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/explain_weather': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/weekly_forecast': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})