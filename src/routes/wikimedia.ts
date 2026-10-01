import type { Platform } from '../types';

export default {
  title: 'Wikimedia',
  icon: 'wikimediafoundation',
  link: 'meta.wikimedia.org/wiki/User:CanonNi',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
