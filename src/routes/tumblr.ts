import type { Platform } from '../types';

export default {
  title: 'Tumblr',
  icon: 'tumblr',
  link: 'www.tumblr.com/blog/canonni',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
