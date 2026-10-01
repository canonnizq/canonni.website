import type { Platform } from '../types';

export default {
  title: 'Flickr',
  icon: 'flickr',
  link: 'www.flickr.com/photos/200807288@N06/',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
