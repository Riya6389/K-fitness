// vite.config.js for k fitness
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/K-fitness/', // ✅ required for subpath route
  plugins: [react()],
});
