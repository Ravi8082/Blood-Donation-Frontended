import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173, // Ensure it binds to Render's PORT
    host: '0.0.0.0', // Allow external access
    strictPort: true, // Ensures the port is used as expected
    cors: true, // Enable CORS for cross-origin requests
    allowedHosts: ['blood-donation-frontended-8.onrender.com'], // Allow the frontend domain
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
    strictPort: true,
  },
});
