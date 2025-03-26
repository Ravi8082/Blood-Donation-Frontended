import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173, // Ensure it binds to Render's PORT
    host: '0.0.0.0', // Allow external access
  },
})
