import type { Route } from '../types';

export default {
  id: 'instagram',
  title: 'Insta',
  icon: 'instagram',
  link: 'www.instagram.com/canonnizq/',
  // RSSHub's Instagram route is anti-bot protected and may need a cookie on the
  // RSSHub server; there is no public native feed to fall back to.
  feed: [{ rsshub: '/instagram/user/canonnizq' }],
} satisfies Route;
