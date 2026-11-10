import type { Route } from '../types';

export default {
  id: 'youtube',
  title: 'YouTube',
  icon: 'youtube',
  link: 'www.youtube.com/@CanonNi',
  // RSSHub resolves the @handle with its keyless YouTube client, which YouTube
  // sometimes blocks on shared public instances (self-host RSSHub if so). The
  // native YouTube RSS feed needs the UC… channel id, which we don't have, so it
  // is deliberately not used as a fallback.
  feed: [{ rsshub: '/youtube/user/@CanonNi' }],
} satisfies Route;
