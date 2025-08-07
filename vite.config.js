import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/index.js'),
      },
      output: {
        entryFileNames: 'content.bundle.js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'esnext',
  },
  publicDir: 'public',
});
