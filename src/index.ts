import type { Route, Stat } from './types';

/**
 * Resolve a route's live stats. Routes that haven't implemented `stats()` yet
 * return an empty list, which the card renders as "—".
 */
export async function getStats(route: Route): Promise<Stat[]> {
  return route.stats?.() ?? [];
}
