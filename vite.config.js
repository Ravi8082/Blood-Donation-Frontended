import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Bind to all interfaces
    port: process.env.PORT || 4173, // Use Render's PORT or default to 4173
    strictPort: true,
  },
});
