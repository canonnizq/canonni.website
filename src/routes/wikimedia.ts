import type { Route } from '../types';

export default {
  id: 'wikimedia',
  title: 'Wikimedia',
  icon: 'wikimediafoundation',
  link: 'meta.wikimedia.org/wiki/User:CanonNi',
  // MediaWiki exposes a user's contributions as an RSS feed on Special:Contributions.
  feed: [
    {
      url: 'https://meta.wikimedia.org/w/index.php?title=Special:Contributions/CanonNi&feed=rss',
    },
  ],
} satisfies Route;
