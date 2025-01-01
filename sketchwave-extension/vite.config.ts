import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: {
        popup: 'index.html',
        contentScript: './src/contentScript.ts',
        background: './src/background.ts',
      },
      output: {
        entryFileNames: '[name].js',
      }
    }
  }
});
