import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// GitHub Pages serves project sites from /<repo-name>/.
// If you rename the repo, change this (or set VITE_BASE when building).
const REPO_BASE = '/MVH-Kiosk/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.VITE_BASE || REPO_BASE) : '/',
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 2000
  }
}));
