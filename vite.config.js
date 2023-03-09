import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        players: resolve(__dirname, 'players/index.html'),
        scoreboard: resolve(__dirname, 'scoreboard/index.html'),
      }
    }
  },
  define: {
    'process.env': process.env,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
  }
})
