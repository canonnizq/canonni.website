import type { Platform } from '../types';

export default {
  title: 'Insta',
  icon: 'instagram',
  link: 'www.instagram.com/canonnizq/',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
