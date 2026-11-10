import type { Route } from '../types';

export default {
  id: 'geocaching',
  title: 'Geocaching',
  icon: 'geocaching',
  link: 'www.geocaching.com/p/?u=CanonNi',
  // RSSHub only serves the official Geocaching blog; the profile has no feed.
} satisfies Route;
