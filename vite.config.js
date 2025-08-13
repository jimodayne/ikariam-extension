import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/index.js'),
        style: resolve(__dirname, 'src/style.css'), // add CSS entry
      },
      output: {
        entryFileNames: 'content.bundle.js',
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css') return 'style.bundle.css';
          return '[name].[ext]';
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'esnext',
  },
  publicDir: 'public',
});
