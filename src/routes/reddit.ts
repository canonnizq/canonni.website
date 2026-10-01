import type { Platform } from '../types';

export default {
  title: 'Reddit',
  icon: 'reddit',
  link: 'www.reddit.com/user/CanonNi/',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
