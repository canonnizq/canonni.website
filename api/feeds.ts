import { collectFeeds } from '../server/feeds';

/**
 * `GET /api/feeds` — the site's only feed endpoint.
 *
 * Vercel runs this as a Node function; `vite.config.ts` mounts the same
 * collector on the dev server, so the client always requests a same-origin
 * `/api/feeds` and RSSHub is never exposed to (or fetched by) the browser.
 *
 * Cached for ten minutes at the CDN and five minutes per warm instance (see
 * `server/feeds.ts`), which is far below RSSHub's own cache TTL.
 */

const CACHE_CONTROL = 'public, s-maxage=600, stale-while-revalidate=86400';

/** Collected feeds can legitimately take a few seconds with cold upstreams. */
export const config = { maxDuration: 30 };

/** The subset of Vercel's Node request object used here. */
interface ApiRequest {
  method?: string;
}

/** The subset of Vercel's Node response object used here. */
interface ApiResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
}

export default async function handler(request: ApiRequest, response: ApiResponse): Promise<void> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET, HEAD');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const payload = await collectFeeds();
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', CACHE_CONTROL);
    response.setHeader('Vercel-CDN-Cache-Control', CACHE_CONTROL);
    response.end(request.method === 'HEAD' ? undefined : JSON.stringify(payload));
  } catch {
    response.statusCode = 502;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.end(JSON.stringify({ error: 'Feed collection failed' }));
  }
}
