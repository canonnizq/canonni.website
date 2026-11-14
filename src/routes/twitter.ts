import type { Route } from '../types';

export default {
  id: 'twitter',
  title: 'Twitter',
  icon: 'x',
  link: 'x.com/canonnical',
  // RSSHub's X/Twitter routes require server-side credentials
  // (TWITTER_AUTH_TOKEN or API keys), so a public RSSHub cannot serve this.
} satisfies Route;
