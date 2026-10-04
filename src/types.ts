export interface FeedItem {
  id?: string;
  url?: string;
  title?: string;
  date?: string;
}

export interface Feed {
  title?: string;
  link?: string;
  items: FeedItem[];
}

/** A single stat rendered on an expanded card. */
export interface Stat {
  name?: string;
  value?: number;
}

/** A social platform: how it looks, where it links, and how to read its feed. */
export interface Route {
  title: string;
  icon: string;
  link: string;
  /** Use `link` verbatim instead of prepending `https://` (e.g. `mailto:`). */
  absolute?: boolean;
  /** Live stats for this platform; empty until implemented. */
  stats?: () => Stat[];
  /** Latest feed items for this platform; empty until implemented. */
  feed?: () => FeedItem[];
}