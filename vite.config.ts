import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { buildSync } from 'esbuild';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        chunkFileNames: 'index.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.originalFileNames.some((name) => name.endsWith('.css'))) {
            return 'styles.css';
          }
          return '[name].[ext]';
        },
      }
    }
  },
  plugins: [
    solidPlugin(),
    {
      name: 'force-reload',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          server.ws.send({ type: 'full-reload' });
        }
      }
    },
    {
      name: 'build-service-worker',
      apply: 'build',
      enforce: 'post',
      writeBundle() {
        buildSync({
          minify: true,
          bundle: true,
          entryPoints: [path.join(process.cwd(), 'src/service-worker.js')],
          outfile: path.join(process.cwd(), 'dist', 'service-worker.js')
        })
      }
    },
    {
      name: 'serve-service-worker',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/service-worker.js') {
            const filePath = path.resolve('src', 'service-worker.js');
            res.setHeader('Content-Type', 'application/javascript');
            res.write(fs.readFileSync(filePath, 'utf-8'));
            res.end();
          } else {
            next();
          }
        });
      }
    }
  ],
});
