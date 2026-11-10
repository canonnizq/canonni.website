import type { Route } from '../types';

export default {
  id: 'bilibili',
  title: 'Bilibili',
  icon: 'bilibili',
  link: 'space.bilibili.com/235513366',
  // The uploads route needs a headless browser on the RSSHub instance, and the
  // dynamic route additionally needs a BILIBILI_COOKIE. Both are reliable only
  // when RSSHub is self-hosted; a restricted public instance degrades to an
  // error card.
  feed: [{ rsshub: '/bilibili/user/video/235513366' }],
} satisfies Route;
