import type { Platform } from '../types';

export default {
  title: 'Geocaching',
  icon: 'geocaching',
  link: 'www.geocaching.com/p/?u=CanonNi',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
