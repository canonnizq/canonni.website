interface Env {
  RSSHUB_BASE?: string;
}

const DEFAULT_RSSHUB_BASE = 'https://rsshub.app';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Generic RSSHub passthrough. The client calls `/rsshub/<rsshub-path>`, which is
 * forwarded to `RSSHUB_BASE` server-side (no browser CORS) and cached at the edge.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }));
    }
    if (request.method !== 'GET') {
      return withCors(new Response('Method not allowed', { status: 405 }));
    }

    const url = new URL(request.url);
    if (!url.pathname.startsWith('/rsshub/')) {
      return withCors(new Response('Not found', { status: 404 }));
    }

    const base = (env.RSSHUB_BASE ?? DEFAULT_RSSHUB_BASE).replace(/\/$/, '');
    const target = `${base}${url.pathname.slice('/rsshub'.length)}${url.search}`;

    try {
      const upstream = await fetch(target, {
        headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
        cf: { cacheTtl: 900, cacheEverything: true },
      } as RequestInit);

      const headers = new Headers(upstream.headers);
      headers.set('Cache-Control', 'public, max-age=900');
      return withCors(new Response(upstream.body, { status: upstream.status, headers }));
    } catch {
      return withCors(new Response('Upstream feed request failed', { status: 502 }));
    }
  },
};
