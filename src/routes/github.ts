import type { Platform } from '../types';

export default {
  title: 'GitHub',
  icon: 'github',
  link: 'github.com/canonnizq',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
