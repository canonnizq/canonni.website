import type { Route } from '../types';

export default {
  id: 'github',
  title: 'GitHub',
  icon: 'github',
  link: 'github.com/canonnizq',
  // RSSHub's activity route proxies GitHub's own public activity Atom feed;
  // hitting that feed directly is the fallback when RSSHub is unavailable.
  feed: [
    { rsshub: '/github/activity/canonnizq' },
    { url: 'https://github.com/canonnizq.atom' },
  ],
} satisfies Route;
