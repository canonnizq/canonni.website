import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { fetchFeeds } from '../client';
import { routes, type Route } from '../routes';
import type { RouteFeed } from '../types';
import styles from '../styles/Socials.module.css';

// Number of recent updates a card shows unless the route overrides it.
const DEFAULT_LIMIT = 5;
const FALLBACK_COLOR = '#948979';

// Simple Icons brand colors that are too dark to read on the dark background fall
// back to the light neutral tint, so the logo stays visible.
const brandTint = (hex: string) => {
  const value = parseInt(hex.slice(1), 16);
  const luminance =
    (0.2126 * ((value >> 16) & 255) + 0.7152 * ((value >> 8) & 255) + 0.0722 * (value & 255)) /
    255;
  return luminance < 1 ? '#dfd0b8' : hex;
};

// The Simple Icons CDN embeds the official brand color in the SVG's fill
// attribute, so we fetch the icon and read it straight from the source.
const fetchBrandColor = async (slug: string): Promise<string> => {
  try {
    const response = await fetch(`https://cdn.simpleicons.org/${slug}`);
    if (!response.ok) return FALLBACK_COLOR;
    const svg = await response.text();
    const match = /fill="(#[0-9a-fA-F]{6})"/.exec(svg);
    return match ? match[1] : FALLBACK_COLOR;
  } catch {
    return FALLBACK_COLOR;
  }
};

const resolveLink = (route: Route) =>
  route.absolute ? route.link : `https://${route.link}`;

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

// Narrow relative labels give the compact "3d ago" / "2mo ago" wording.
const relativeDate = new Intl.RelativeTimeFormat('en', {
  numeric: 'always',
  style: 'narrow',
});
const absoluteDate = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const DATE_UNITS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
  ['year', YEAR],
  ['month', MONTH],
  ['week', WEEK],
  ['day', DAY],
  ['hour', HOUR],
  ['minute', MINUTE],
  ['second', 1],
];

interface FormattedDate {
  label: string;
  iso: string;
}

/**
 * Format a feed timestamp for the compact date column.
 *
 * Returns `null` (and the date column is omitted) when the timestamp is missing
 * or unparseable, so a malformed feed never renders a placeholder dash. Items
 * older than a year fall back to a formatted absolute date instead of an
 * ever-growing "13mo ago".
 */
const formatDate = (value?: string): FormattedDate | null => {
  if (!value) return null;
  const time = Date.parse(value);
  if (Number.isNaN(time)) return null;

  const iso = new Date(time).toISOString();
  const seconds = Math.round((time - Date.now()) / 1000);
  const magnitude = Math.abs(seconds);

  if (magnitude < MINUTE) return { label: 'now', iso };
  if (magnitude > YEAR) return { label: absoluteDate.format(time), iso };

  const [unit, size] =
    DATE_UNITS.find(([, unitSize]) => magnitude >= unitSize) ??
    DATE_UNITS[DATE_UNITS.length - 1];

  return {
    label: relativeDate.format(Math.round(seconds / size) || 0, unit),
    iso,
  };
};

// `fetchFeeds()` either resolves every route's updates or rejects when the
// whole endpoint is unavailable; both outcomes are modelled as plain states so
// the pills keep working regardless of the feed's health.
type FeedState =
  | { status: 'loading' }
  | { status: 'ready'; feeds: Record<string, RouteFeed> }
  | { status: 'unavailable' };

interface FeedUpdatesProps {
  route: Route;
  feedState: FeedState;
}

/** The expanded card's body: recent updates, or the reason there are none. */
function FeedUpdates({ route, feedState }: FeedUpdatesProps) {
  const hasFeed = Array.isArray(route.feed) && route.feed.length > 0;

  // Platforms without a public feed explain themselves even before the
  // endpoint resolves — there is nothing to wait for.
  if (!hasFeed) {
    return <p className={styles.status}>No public feed for this platform.</p>;
  }

  if (feedState.status === 'loading') {
    return (
      <div className={styles.loading}>
        <span className={styles.srOnly}>Loading updates…</span>
        <span className={`${styles.skeleton} ${styles.skeletonMedium}`} aria-hidden="true" />
        <span className={`${styles.skeleton} ${styles.skeletonShort}`} aria-hidden="true" />
        <span className={styles.skeleton} aria-hidden="true" />
      </div>
    );
  }

  if (feedState.status === 'unavailable') {
    return <p className={styles.status}>Updates are unavailable right now.</p>;
  }

  const feed = feedState.feeds[route.id];
  if (feed?.error) {
    return <p className={styles.status}>Couldn&apos;t load updates.</p>;
  }

  const items = Array.isArray(feed?.items) ? feed.items : [];
  const limit = route.limit ?? DEFAULT_LIMIT;
  const visible = items.slice(0, Math.max(0, limit));

  if (visible.length === 0) {
    return <p className={styles.status}>No recent updates.</p>;
  }

  return (
    <ul className={styles.updateList}>
      {visible.map((item, index) => {
        const title =
          typeof item.title === 'string' && item.title.trim()
            ? item.title.trim()
            : 'Untitled update';
        const date = formatDate(typeof item.date === 'string' ? item.date : undefined);
        const key = item.id ?? item.url ?? `${route.id}-${index}`;
        const body = (
          <>
            <span className={styles.updateTitle}>{title}</span>
            {date ? (
              <time className={styles.updateDate} dateTime={date.iso}>
                {date.label}
              </time>
            ) : null}
          </>
        );

        return (
          <li key={key} className={styles.update}>
            {typeof item.url === 'string' && item.url ? (
              <a
                className={styles.updateLink}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {body}
              </a>
            ) : (
              // Feed items without a usable URL stay as plain text rather than
              // becoming dead or self-referential links.
              <span className={styles.updateLink}>{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Socials() {
  const [active, setActive] = useState<number | null>(null);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [feedState, setFeedState] = useState<FeedState>({ status: 'loading' });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    routes.forEach(({ icon }) => {
      fetchBrandColor(icon).then((color) => {
        if (!cancelled) {
          setColors((prev) => (prev[icon] === color ? prev : { ...prev, [icon]: color }));
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchFeeds()
      .then((feeds) => {
        if (!cancelled) setFeedState({ status: 'ready', feeds });
      })
      .catch(() => {
        if (!cancelled) setFeedState({ status: 'unavailable' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActive(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {routes.map((route, index) => {
        const expanded = active === index;
        // `route.id` is the stable handle; the title/index fallbacks keep the
        // card renderable if a route definition is still catching up.
        const routeKey = route.id || route.title;
        const panelId = `social-panel-${route.id || index}`;
        const brand = colors[route.icon] ?? FALLBACK_COLOR;
        const iconSrc = (tint: string) => `https://cdn.simpleicons.org/${route.icon}/${tint}`;

        return (
          <div
            key={routeKey}
            style={
              {
                '--brand': brand,
                '--brand-text': brandTint(brand),
              } as CSSProperties
            }
            className={expanded ? `${styles.pill} ${styles.pillExpanded}` : styles.pill}
          >
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setActive(expanded ? null : index)}
            >
              <img height={15} src={iconSrc('948979')} alt="" />
              <span className={styles.label}>{route.title}</span>
            </button>

            <div id={panelId} className={styles.panel} aria-hidden={!expanded} inert={!expanded}>
              <div className={styles.panelInner}>
                <header className={styles.header}>
                  <div className={styles.logoWrap}>
                    <img
                      className={styles.logo}
                      height={44}
                      src={iconSrc(brandTint(brand).slice(1))}
                      alt=""
                    />
                  </div>
                  <div className={styles.titleBlock}>
                    <a
                      className={styles.title}
                      href={resolveLink(route)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {route.title} ↗
                    </a>
                    <p className={styles.note}>{route.link}</p>
                  </div>
                </header>

                <FeedUpdates route={route} feedState={feedState} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
