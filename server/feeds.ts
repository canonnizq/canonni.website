import { XMLParser } from 'fast-xml-parser';

import { routes } from '../src/routes';
import type { FeedItem, FeedSource, FeedsResponse, Route, RouteFeed } from '../src/types';

/**
 * Server-side feed collector shared by the Vercel function (`api/feeds.ts`) and
 * the Vite dev middleware (`vite.config.ts`). It knows nothing about the
 * request/response objects of either runtime: it just returns a `FeedsResponse`.
 *
 * Every route in `src/routes/` declares where its updates live; this module
 * fetches them in parallel, normalises RSS/Atom/JSON Feed documents into the
 * small `FeedItem` shape the UI renders, and caches the result per serverless
 * instance.
 */

const DEFAULT_RSSHUB_BASE = 'https://rsshub.app';
const DEFAULT_LIMIT = 5;
/** Keep the whole collection under the default Vercel function budget. */
const REQUEST_TIMEOUT_MS = 6_500;
const CACHE_TTL_MS = 5 * 60 * 1000;

const USER_AGENT = `canonni.website feed collector (+https://canonni.website)`;
const ACCEPT_HEADER = [
  'application/feed+json',
  'application/json',
  'application/atom+xml',
  'application/rss+xml',
  'application/xml;q=0.9',
  'text/xml;q=0.8',
  '*/*;q=0.5',
].join(', ');

const xml = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  processEntities: true,
  trimValues: true,
});

let cache: { at: number; value: FeedsResponse } | null = null;
let inflight: Promise<FeedsResponse> | null = null;

/**
 * Collect recent updates for every route that declares a feed source.
 *
 * `routeList` overrides the shared registry; it exists so tests can point
 * routes at a local fake upstream instead of the real services.
 */
export async function collectFeeds(routeList: readonly Route[] = routes): Promise<FeedsResponse> {
  const useCache = routeList === routes;
  if (useCache && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.value;
  }
  if (useCache && inflight) {
    return inflight;
  }

  const run = (async () => {
    const feedRoutes = routeList.filter((route) => route.feed && route.feed.length > 0);
    const entries = await Promise.all(
      feedRoutes.map(async (route) => [route.id, await collectRoute(route)] as const)
    );
    const value: FeedsResponse = {
      fetchedAt: new Date().toISOString(),
      feeds: Object.fromEntries(entries),
    };

    // Don't pin a completely failed collection for the whole TTL: the next
    // request should be allowed to retry upstreams that were briefly down.
    if (useCache && entries.some(([, feed]) => !feed.error)) {
      cache = { at: Date.now(), value };
    }
    return value;
  })();

  if (!useCache) {
    return run;
  }

  inflight = run.finally(() => {
    inflight = null;
  });
  return inflight;
}

async function collectRoute(route: Route): Promise<RouteFeed> {
  const sources = route.feed ?? [];
  const limit = route.limit ?? DEFAULT_LIMIT;
  const results = await Promise.allSettled(sources.map((source) => loadSource(source)));

  for (const result of results) {
    if (result.status === 'fulfilled') {
      try {
        return { items: normaliseItems(result.value, limit) };
      } catch {
        return { items: [], error: 'feed items could not be read' };
      }
    }
  }

  const firstError = results.find(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  );
  return {
    items: [],
    error: firstError ? errorMessage(firstError.reason) : 'No feed source is configured',
  };
}

/** Fetch one source and return its raw, not-yet-normalised items. */
async function loadSource(source: FeedSource): Promise<FeedItem[]> {
  const url = resolveSourceUrl(source);

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: ACCEPT_HEADER },
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`upstream responded with ${response.status}`);
  }

  const body = await readResponseBody(response);
  return parseFeedDocument(body, response.headers.get('content-type'));
}

const UTF8 = 'utf-8';

/**
 * Decode the body with the charset the server or XML declaration advertises.
 * Most feeds are UTF-8, but some Chinese and legacy platforms are not.
 */
async function readResponseBody(response: Response): Promise<string> {
  const bytes = new Uint8Array(await response.arrayBuffer());
  const charset = detectCharset(response.headers.get('content-type'), bytes) ?? UTF8;

  if (charset !== UTF8) {
    try {
      return new TextDecoder(charset).decode(bytes);
    } catch {
      // Unknown charset label: fall back to UTF-8 rather than failing the feed.
    }
  }
  return new TextDecoder(UTF8).decode(bytes);
}

function detectCharset(contentType: string | null, bytes: Uint8Array): string | undefined {
  const fromHeader = /charset="?([^";]+)"?/i.exec(contentType ?? '')?.[1]?.trim().toLowerCase();
  if (fromHeader) {
    return fromHeader;
  }
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 200));
  return /<\?xml[^>]+encoding=["']([^"']+)["']/i.exec(head)?.[1]?.trim().toLowerCase();
}

function resolveSourceUrl(source: FeedSource): string {
  if (source.rsshub) {
    const base = (process.env.RSSHUB_BASE ?? DEFAULT_RSSHUB_BASE).replace(/\/+$/, '');
    const path = source.rsshub.startsWith('/') ? source.rsshub : `/${source.rsshub}`;
    return `${base}${path}`;
  }
  if (source.url) {
    const url = new URL(source.url);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error(`unsupported source protocol: ${url.protocol}`);
    }
    return url.toString();
  }
  throw new Error('feed source has neither an RSSHub path nor a URL');
}

/* -------------------------------------------------------------------------- */
/* Parsing                                                                    */
/* -------------------------------------------------------------------------- */

function parseFeedDocument(body: string, contentType: string | null): FeedItem[] {
  const trimmed = body.trimStart();
  const looksLikeJson =
    trimmed.startsWith('{') || Boolean(contentType?.toLowerCase().includes('json'));
  return looksLikeJson ? parseJsonFeed(body) : parseXmlFeed(body);
}

interface JsonFeedItem {
  id?: string;
  url?: string;
  external_url?: string;
  title?: string;
  content_text?: string;
  date_published?: string;
  date_modified?: string;
}

function parseJsonFeed(body: string): FeedItem[] {
  const document = JSON.parse(body) as { items?: JsonFeedItem[] };
  if (!Array.isArray(document.items)) {
    throw new Error('response is JSON but not a JSON Feed');
  }
  return document.items.map((item) => ({
    id: item.id,
    url: item.external_url ?? item.url,
    title: item.title ?? item.content_text,
    date: item.date_published ?? item.date_modified,
  }));
}

type XmlNode = Record<string, unknown>;

function parseXmlFeed(body: string): FeedItem[] {
  const document = xml.parse(body) as XmlNode;
  const rssChannel = asNode(asNode(document.rss)?.channel);
  const rdf = asNode(document['rdf:RDF']);
  const atomFeed = asNode(document.feed);

  if (rssChannel) {
    return asArray(rssChannel.item).flatMap((entry) => xmlItemToFeedItem(asNode(entry), 'rss'));
  }
  if (rdf) {
    // RSS 1.0 keeps <item> elements next to <channel> under <rdf:RDF>, not
    // inside it. Some producers still nest them, so accept both shapes.
    const rdfItems = asArray(rdf.item);
    if (rdfItems.length > 0) {
      return rdfItems.flatMap((entry) => xmlItemToFeedItem(asNode(entry), 'rss'));
    }
    const rdfChannel = asNode(rdf.channel);
    if (rdfChannel) {
      return asArray(rdfChannel.item).flatMap((entry) => xmlItemToFeedItem(asNode(entry), 'rss'));
    }
  }
  if (atomFeed) {
    return asArray(atomFeed.entry).flatMap((entry) => xmlItemToFeedItem(asNode(entry), 'atom'));
  }
  throw new Error('response is not an RSS, Atom, or JSON Feed document');
}

function xmlItemToFeedItem(node: XmlNode | undefined, kind: 'rss' | 'atom'): FeedItem[] {
  if (!node) {
    return [];
  }

  const title = textOf(node.title);
  const url = kind === 'atom' ? atomLink(node.link) : textOf(node.link) ?? atomLink(node.link);
  const date = textOf(node.pubDate ?? node['dc:date'] ?? node.published ?? node.updated);
  const id = textOf(node.guid) ?? textOf(node.id);

  if (!title && !url) {
    return [];
  }
  return [{ id, url, title, date }];
}

/** Atom `<link>` entries are attribute-only and can be repeated. */
function atomLink(value: unknown): string | undefined {
  let fallback: string | undefined;

  for (const entry of asArray(value)) {
    const node = asNode(entry);
    if (!node) {
      const text = textOf(entry);
      if (text?.startsWith('http')) {
        return text;
      }
      continue;
    }

    const href = typeof node['@_href'] === 'string' ? node['@_href'] : textOf(node['#text']);
    if (!href) {
      continue;
    }
    const rel = typeof node['@_rel'] === 'string' ? node['@_rel'] : undefined;
    if (!rel || rel === 'alternate') {
      return href;
    }
    fallback ??= href;
  }

  return fallback;
}

function textOf(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const text = value.trim();
    return text || undefined;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    for (const entry of value) {
      const text = textOf(entry);
      if (text) {
        return text;
      }
    }
    return undefined;
  }

  const node = asNode(value);
  if (!node) {
    return undefined;
  }
  return textOf(node['#text']) ?? textOf(node['@_href']);
}

function asNode(value: unknown): XmlNode | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  return value as XmlNode;
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value === undefined || value === null ? [] : [value];
}

/* -------------------------------------------------------------------------- */
/* Normalisation                                                              */
/* -------------------------------------------------------------------------- */

function normaliseItems(items: FeedItem[], limit: number): FeedItem[] {
  const seen = new Set<string>();
  const normalised: FeedItem[] = [];

  for (const item of items) {
    const title = cleanText(item.title);
    const url = sanitiseUrl(item.url);
    if (!title && !url) {
      continue;
    }

    const key = url ?? item.id ?? title;
    if (key) {
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
    }

    normalised.push({ id: item.id, url, title, date: toIsoString(item.date) });
  }

  normalised.sort((a, b) => dateValue(b.date) - dateValue(a.date));
  return normalised.slice(0, limit);
}

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

/** Item links become anchors, so only http(s) URLs may survive normalisation. */
function sanitiseUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  try {
    const url = new URL(value.trim());
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function cleanText(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const text = decodeEntities(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
  return text || undefined;
}

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      return codePointToString(Number.parseInt(entity.slice(2), 16)) ?? match;
    }
    if (entity.startsWith('#')) {
      return codePointToString(Number.parseInt(entity.slice(1), 10)) ?? match;
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function codePointToString(code: number): string | undefined {
  if (!Number.isInteger(code) || code < 0 || code > 0x10ffff) {
    return undefined;
  }
  // Lone surrogates are not valid Unicode scalar values.
  if (code >= 0xd800 && code <= 0xdfff) {
    return undefined;
  }
  return String.fromCodePoint(code);
}

function toIsoString(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString();
}

function dateValue(date: string | undefined): number {
  if (!date) {
    return Number.NEGATIVE_INFINITY;
  }
  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function errorMessage(reason: unknown): string {
  if (reason instanceof Error && reason.message) {
    return reason.message;
  }
  return 'feed request failed';
}
