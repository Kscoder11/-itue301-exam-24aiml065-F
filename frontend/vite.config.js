import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The proxy forwards /api requests to the Express backend, so the frontend can use relative URLs.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
