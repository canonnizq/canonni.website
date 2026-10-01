import type { Platform } from '../types';

const UID_PATTERN = /(\d+)/;

export default {
  title: 'Bilibili',
  icon: 'bilibili',
  link: 'space.bilibili.com/235513366',
  route: {
    path: ({ link }) => {
      const uid = link.match(UID_PATTERN)?.[1];
      return uid ? `/bilibili/user/video/${uid}` : undefined;
    },
    extract: (feed) => ({ posts: feed.items.length }),
  },
} satisfies Platform;
