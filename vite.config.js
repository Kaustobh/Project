import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Project/', // Required for GitHub Pages hosting at https://<username>.github.io/Project/
  server: {
    port: 3000,
    open: true
  }
})
