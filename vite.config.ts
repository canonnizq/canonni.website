import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

import { collectFeeds } from './server/feeds';

/**
 * Serves the production `/api/feeds` handler on the Vite dev server, so the
 * site can be developed with `npm run dev` alone (no Vercel CLI). In
 * production Vercel serves `api/feeds.ts` directly.
 */
function feedsDevApi(): Plugin {
  return {
    name: 'feeds-dev-api',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = request.url ? new URL(request.url, 'http://localhost') : null;
        if (url?.pathname !== '/api/feeds') {
          next();
          return;
        }

        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.statusCode = 405;
          response.setHeader('Allow', 'GET, HEAD');
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        collectFeeds()
          .then((payload) => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.setHeader('Cache-Control', 'no-store');
            if (request.method === 'HEAD') {
              response.end();
            } else {
              response.end(JSON.stringify(payload));
            }
          })
          .catch(() => {
            response.statusCode = 502;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.end(JSON.stringify({ error: 'Feed collection failed' }));
          });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Surface a server-side RSSHUB_BASE from `.env.local` to the dev handler.
  // Vite only exposes VITE_* variables to the client, which is exactly right.
  const env = loadEnv(mode, process.cwd(), '');
  if (env.RSSHUB_BASE && !process.env.RSSHUB_BASE) {
    process.env.RSSHUB_BASE = env.RSSHUB_BASE;
  }

  return {
    // Keep the config on the bundler loader; the native loader can't resolve
    // the extensionless TypeScript imports in `server/`/`src/routes/` yet.
    configLoader: 'bundle',
    plugins: [react(), feedsDevApi()],
  };
});
