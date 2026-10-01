import type { Platform } from '../types';

const HANDLE_PATTERN = /@([\w.-]+)/;

export default {
  title: 'YouTube',
  icon: 'youtube',
  link: 'www.youtube.com/@CanonNi',
  route: {
    path: ({ link }) => {
      const handle = link.match(HANDLE_PATTERN)?.[1];
      return handle ? `/youtube/user/@${handle}` : undefined;
    },
    extract: (feed) => ({ posts: feed.items.length }),
  },
} satisfies Platform;
