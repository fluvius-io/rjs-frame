import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import * as sass from 'sass';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(fileURLToPath(new URL('.', import.meta.url)), './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
        api: 'modern',
        sassOptions: {
          outputStyle: 'compressed',
          includePaths: ['node_modules', '../lib/rjs-frame/src/styles'],
        },
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
}); 