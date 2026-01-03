// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // This ensures assets are loaded from mks-dev.online/asset.js
  plugins: [react()],
});
