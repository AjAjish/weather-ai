import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/weather': 'http://localhost:8000',
      '/explain_weather': 'http://localhost:8000',
      '/ai': 'http://localhost:8000',
    },
  },
})
