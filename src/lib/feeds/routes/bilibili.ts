import type { FeedRoute } from '../types';

const UID_PATTERN = /(\d+)/;

export const bilibiliRoute: FeedRoute = {
  label: 'Bilibili',
  path: (social) => {
    const uid = social.link.match(UID_PATTERN)?.[1];
    return uid ? `/bilibili/user/video/${uid}` : undefined;
  },
  extract: (feed) => ({ posts: feed.items.length }),
};
