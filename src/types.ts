/** A single recent update surfaced on a social card. */
export interface FeedItem {
  id?: string;
  url?: string;
  title?: string;
  /** ISO 8601 timestamp; absent when the platform doesn't expose one. */
  date?: string;
}

/**
 * Where a route's updates come from. Exactly one of `rsshub` or `url` is set.
 *
 * `rsshub` is a route path such as `/bsky/profile/canonni.website`, resolved
 * server-side against `RSSHUB_BASE`. `url` is a native feed for platforms RSSHub
 * can't serve from a public instance (missing route, or one that needs
 * credentials configured on the RSSHub server).
 */
export interface FeedSource {
  /** RSSHub route path, e.g. `/bsky/profile/canonni.website`. */
  rsshub?: string;
  /** Absolute URL of a native RSS/Atom/JSON Feed. */
  url?: string;
}

/** A social platform: how it looks, where it links, and where to read updates. */
export interface Route {
  /** Stable key used by `/api/feeds` and client caches. */
  id: string;
  title: string;
  icon: string;
  link: string;
  /** Use `link` verbatim instead of prepending `https://` (e.g. `mailto:`). */
  absolute?: boolean;
  /**
   * Recent-update sources, tried in order by the server. Omit for platforms
   * that have no public feed at all (Discord, email, Steam, ...); their card
   * still links to the profile but explains that nothing can be fetched.
   */
  feed?: FeedSource[];
  /** Maximum number of recent updates to surface (default 5). */
  limit?: number;
}

/** One route's collected updates, keyed by `Route.id` in `FeedsResponse.feeds`. */
export interface RouteFeed {
  items: FeedItem[];
  /** Sanitised upstream error, when every source for this route failed. */
  error?: string;
}

/** Payload of `GET /api/feeds`. */
export interface FeedsResponse {
  /** ISO 8601 time the server finished collecting the feeds. */
  fetchedAt: string;
  feeds: Record<string, RouteFeed>;
}
