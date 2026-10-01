import type { Platform } from '../types';

export default {
  title: 'Masto',
  icon: 'mastodon',
  link: 'mastodon.social/@CanonNi',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
