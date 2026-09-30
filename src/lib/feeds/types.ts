import type { Social } from '../../types';

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

/** A platform's RSSHub route plus how to map its feed onto the card's stats. */
export interface FeedRoute {
  label: string;
  /** Build the RSSHub path for a social entry; `undefined` means unsupported. */
  path: (social: Social) => string | undefined;
  /** Derive the displayed stats from the raw feed. */
  extract: (feed: Feed) => SocialStats;
}
