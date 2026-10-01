export interface Platform {
  link: string;
  icon: string;
  title: string;
}

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

/** Stats rendered on an expanded Socials card. Any missing key renders as "—". */
export interface SocialStats {
  followers?: number;
  posts?: number;
}

/** A platform's feed source: the RSSHub path plus how its feed maps to stats. */
export interface FeedRoute {
  /** Build the RSSHub path from the platform's metadata; `undefined` means unsupported. */
  path: (metadata: Platform) => string | undefined;
  /** Derive the displayed stats from the raw feed. */
  extract: (feed: Feed) => SocialStats;
}