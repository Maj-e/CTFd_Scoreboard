import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/CTFd_Scoreboard/',
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://lloreria.pro',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
