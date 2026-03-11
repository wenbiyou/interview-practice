import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/interview-practice/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})