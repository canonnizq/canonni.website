import type { Route } from '../types';

export default {
  id: 'steam',
  title: 'Steam',
  icon: 'steam',
  link: 'steamcommunity.com/id/canonni/',
  // RSSHub only covers Steam news/workshop listings; a profile has no feed.
} satisfies Route;
