export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow external access
    port: process.env.PORT || 4173, // Use Render's port or fallback to 4173
    strictPort: true, // Ensures only the specified port is used
  },
});
