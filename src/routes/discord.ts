import type { Route } from '../types';

export default {
  id: 'discord',
  title: 'Discord',
  icon: 'discord',
  link: 'discord.com/users/1195694156035674135',
  // Discord has no public per-user feed: RSSHub's only route reads channel
  // messages with a bot token, which a user profile cannot provide.
} satisfies Route;
