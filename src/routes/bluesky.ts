import type { Route } from '../types';

export default {
  id: 'bluesky',
  title: 'Bluesky',
  icon: 'bluesky',
  link: 'bsky.app/profile/canonni.website',
  feed: [
    { rsshub: '/bsky/profile/canonni.website' },
    { url: 'https://bsky.app/profile/canonni.website/rss' },
  ],
} satisfies Route;
