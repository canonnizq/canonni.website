import type { Platform } from '../types';

export default {
  title: 'Steam',
  icon: 'steam',
  link: 'steamcommunity.com/id/canonni/',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
