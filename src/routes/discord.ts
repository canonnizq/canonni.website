import type { Platform } from '../types';

export default {
  title: 'Discord',
  icon: 'discord',
  link: 'discord.com/users/1195694156035674135',
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
