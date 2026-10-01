import type { Platform } from './types';
import { fetchFeed } from './client';
import type { SocialStats } from './lib/feeds/types';

export type { SocialStats } from './lib/feeds/types';

/** Resolve the live stats for a platform, or `{}` when it has no usable route. */
export async function getStats(platform: Platform): Promise<SocialStats> {
  const path = platform.route.path(platform);
  if (!path) {
    return {};
  }

  try {
    return platform.route.extract(await fetchFeed(path));
  } catch {
    return {};
  }
}
