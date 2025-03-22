import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Allows external access
    strictPort: true,
    allowedHosts: "blood-donation-frontended-7.onrender.com"
  }
})
