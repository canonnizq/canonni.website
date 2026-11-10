import type { Route } from '../types';

export default {
  id: 'tumblr',
  title: 'Tumblr',
  icon: 'tumblr',
  link: 'www.tumblr.com/blog/canonni',
  // RSSHub's Tumblr route needs TUMBLR_* API credentials on the server; the
  // blog's own RSS feed is public. Try the modern URL first, then the legacy
  // subdomain form.
  feed: [
    { url: 'https://www.tumblr.com/canonni/rss' },
    { url: 'https://canonni.tumblr.com/rss' },
  ],
} satisfies Route;
