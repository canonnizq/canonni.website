import type { Feed } from './lib/feeds/types';

/**
 * Base URL of the feed proxy (the Cloudflare Worker in `worker/`). Set
 * VITE_FEED_PROXY in production; locally it defaults to a `wrangler dev` instance.
 */
const PROXY_BASE = import.meta.env.VITE_FEED_PROXY ?? 'http://localhost:8787';

const CACHE_TTL = 15 * 60 * 1000;
const cache = new Map<string, { at: number; value: Feed }>();

/** Fetch an RSSHub path (e.g. `/youtube/user/@CanonNi`) through the proxy. */
export async function fetchFeed(path: string): Promise<Feed> {
  const cached = cache.get(path);
  if (cached && Date.now() - cached.at < CACHE_TTL) {
    return cached.value;
  }

  const response = await fetch(`${PROXY_BASE}/rsshub${path}`);
  if (!response.ok) {
    throw new Error(`Feed request failed (${response.status}): ${path}`);
  }

  const feed = parseFeed(await response.text(), response.headers.get('content-type'));
  cache.set(path, { at: Date.now(), value: feed });
  return feed;
}

interface JsonFeedItem {
  id?: string;
  url?: string;
  title?: string;
  date_published?: string;
}

/** RSSHub can return JSON Feed, but fall back to parsing RSS/Atom. */
function parseFeed(body: string, contentType: string | null): Feed {
  const trimmed = body.trimStart();
  if (contentType?.includes('json') || trimmed.startsWith('{')) {
    const json = JSON.parse(body) as {
      title?: string;
      home_page_url?: string;
      items?: JsonFeedItem[];
    };
    return {
      title: json.title,
      link: json.home_page_url,
      items: (json.items ?? []).map((item) => ({
        id: item.id,
        url: item.url,
        title: item.title,
        date: item.date_published,
      })),
    };
  }

  const doc = new DOMParser().parseFromString(body, 'application/xml');
  const items = [...doc.querySelectorAll('item, entry')].map((entry) => ({
    id: entry.querySelector('guid, id')?.textContent ?? undefined,
    url:
      entry.querySelector('link')?.getAttribute('href') ??
      entry.querySelector('link')?.textContent ??
      undefined,
    title: entry.querySelector('title')?.textContent ?? undefined,
    date: entry.querySelector('pubDate, updated, published')?.textContent ?? undefined,
  }));

  return {
    title: doc.querySelector('channel > title, feed > title')?.textContent ?? undefined,
    items,
  };
}
