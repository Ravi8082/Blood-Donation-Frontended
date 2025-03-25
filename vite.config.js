import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allow connections from any IP
    port: 4173,       // Ensure it's using the right port
    strictPort: true,
    cors: true,
    allowedHosts: ["https://blood-donation-frontended-8.onrender.com"], // Allow your Render domain
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    cors: true,
    allowedHosts: ["https://blood-donation-frontended-8.onrender.com"], // Ensure allowed in preview mode
  }
});
