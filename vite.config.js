import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/K-fitness/', // 👈 VERY IMPORTANT FOR GITHUB PAGES
});
