import type { FeedRoute } from '../types';
import { bilibiliRoute } from './bilibili';
import { youtubeRoute } from './youtube';

/**
 * Registry of feed routes, keyed by a social's Simple Icons slug.
 *
 * To support a new platform: add a `routes/<platform>.ts` file exporting a
 * `FeedRoute`, then register it here. Platforms without an entry simply render
 * "—" for every stat.
 */
export const routes: Record<string, FeedRoute> = {
  bilibili: bilibiliRoute,
  youtube: youtubeRoute,
};
