import type { Platform } from '../types';

export default {
  title: 'Twitter',
  icon: 'x',
  link: 'x.com/canonnizq',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
