import type { Platform } from '../types';

export default {
  title: 'Medium',
  icon: 'medium',
  link: 'medium.com/@CanonNi',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
