import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { buildSync } from 'esbuild';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  build: { manifest: 'vite-manifest.json', target: 'esnext' },
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
          minify: false,
          bundle: false,
          define: {
            __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString())
          },
          format: 'esm',
          write: true,
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
