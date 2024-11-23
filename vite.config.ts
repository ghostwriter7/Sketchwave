import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin(), {
    name: 'force-reload',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        server.ws.send({ type: 'full-reload' });
      }
    }
  }]
});
