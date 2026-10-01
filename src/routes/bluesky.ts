import type { Platform } from '../types';

export default {
  title: 'Bluesky',
  icon: 'bluesky',
  link: 'bsky.app/profile/canonni.website',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
