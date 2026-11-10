import type { FeedsResponse, RouteFeed } from './types';

/**
 * The feed endpoint is a Vercel function (`api/feeds.ts`) in production and a
 * Vite dev middleware with the same handler locally, so the client always hits
 * a same-origin `/api/feeds` and never talks to RSSHub directly.
 */
const ENDPOINT = '/api/feeds';

const CACHE_TTL = 10 * 60 * 1000;
/** The function caps itself around 30s; don't hang the UI if the CDN stalls. */
const REQUEST_TIMEOUT = 30_000;

let cached: { at: number; value: Record<string, RouteFeed> } | null = null;
let inflight: Promise<Record<string, RouteFeed>> | null = null;

/**
 * Fetch recent updates for every route, keyed by `Route.id`.
 *
 * Results are cached in memory for `CACHE_TTL`, and concurrent callers share
 * one request. Throws when the endpoint itself is unreachable; individual
 * route failures are reported per entry via `RouteFeed.error`.
 */
export async function fetchFeeds(): Promise<Record<string, RouteFeed>> {
  if (cached && Date.now() - cached.at < CACHE_TTL) {
    return cached.value;
  }
  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    try {
      const response = await fetch(ENDPOINT, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      if (!response.ok) {
        throw new Error(`Feed endpoint responded with ${response.status}`);
      }
      const payload = (await response.json()) as FeedsResponse;
      cached = { at: Date.now(), value: payload.feeds ?? {} };
      return cached.value;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}
