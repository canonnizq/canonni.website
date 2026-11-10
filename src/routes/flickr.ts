import type { Route } from '../types';

export default {
  id: 'flickr',
  title: 'Flickr',
  icon: 'flickr',
  link: 'www.flickr.com/photos/200807288@N06/',
  // RSSHub has no Flickr route in the current release; Flickr still publishes a
  // public photo feed keyed by the account's NSID.
  feed: [
    {
      url: 'https://www.flickr.com/services/feeds/photos_public.gne?id=200807288@N06&format=rss2',
    },
  ],
} satisfies Route;
