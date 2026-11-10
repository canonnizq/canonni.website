import type { Route } from '../types';

export default {
  id: 'mastodon',
  title: 'Masto',
  icon: 'mastodon',
  link: 'mastodon.social/@CanonNi',
  feed: [
    { rsshub: '/mastodon/acct/CanonNi@mastodon.social/statuses' },
    { url: 'https://mastodon.social/@CanonNi.rss' },
  ],
} satisfies Route;
