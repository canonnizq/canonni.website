import type { FeedRoute } from '../types';

const HANDLE_PATTERN = /@([\w.-]+)/;

export const youtubeRoute: FeedRoute = {
  label: 'YouTube',
  path: (social) => {
    const handle = social.link.match(HANDLE_PATTERN)?.[1];
    return handle ? `/youtube/user/@${handle}` : undefined;
  },
  extract: (feed) => ({ posts: feed.items.length }),
};
