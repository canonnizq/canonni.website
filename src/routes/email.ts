import type { Platform } from '../types';

export default {
  title: 'Email',
  icon: 'mail.ru',
  link: 'mailto:canonnizq@gmail.com',
  absolute: true,
  // TODO: implement this platform's RSSHub route.
  route: {
    path: () => undefined,
    extract: () => ({}),
  },
} satisfies Platform;
