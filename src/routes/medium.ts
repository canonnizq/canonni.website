import type { Route } from '../types';

export default {
  id: 'medium',
  title: 'Medium',
  icon: 'medium',
  link: 'medium.com/@CanonNi',
  feed: [
    { rsshub: '/medium/feed/CanonNi' },
    { url: 'https://medium.com/feed/@CanonNi' },
  ],
} satisfies Route;
