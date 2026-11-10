import type { Route } from '../types';

export default {
  id: 'reddit',
  title: 'Reddit',
  icon: 'reddit',
  link: 'www.reddit.com/user/CanonNi/',
  // RSSHub has no Reddit route in the current release; Reddit's user RSS feed
  // is the only public source. Reddit sometimes rate-limits datacenter IPs.
  feed: [{ url: 'https://www.reddit.com/user/CanonNi/.rss' }],
} satisfies Route;
