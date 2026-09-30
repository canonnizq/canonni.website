import type { Social } from '../../types';
import { fetchFeed } from './client';
import { routes } from './routes';
import type { SocialStats } from './types';

export type { SocialStats } from './types';

/** Resolve the live stats for a social entry, or `{}` when unsupported. */
export async function getStats(social: Social): Promise<SocialStats> {
  const route = routes[social.icon];
  if (!route) {
    return {};
  }

  const path = route.path(social);
  if (!path) {
    return {};
  }

  try {
    return route.extract(await fetchFeed(path));
  } catch {
    return {};
  }
}
