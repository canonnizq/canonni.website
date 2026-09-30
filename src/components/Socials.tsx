import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { getStats, type SocialStats } from '../lib/feeds';
import styles from '../styles/Socials.module.css';
import type { Social } from '../types';

const socials: Social[] = [
  { link: 'space.bilibili.com/235513366', icon: 'bilibili', title: 'Bilibili' },
  { link: 'bsky.app/profile/canonni.website', icon: 'bluesky', title: 'Bluesky' },
  { link: 'discord.com/users/1195694156035674135', icon: 'discord', title: 'Discord' },
  { link: 'mailto:canonnizq@gmail.com', icon: 'mail.ru', title: 'Email', override: true },
  { link: 'www.flickr.com/photos/200807288@N06/', icon: 'flickr', title: 'Flickr' },
  { link: 'www.geocaching.com/p/?u=CanonNi', icon: 'geocaching', title: 'Geocaching' },
  { link: 'github.com/canonnizq', icon: 'github', title: 'GitHub' },
  { link: 'www.instagram.com/canonnizq/', icon: 'instagram', title: 'Insta' },
  { link: 'mastodon.social/@CanonNi', icon: 'mastodon', title: 'Masto' },
  { link: 'medium.com/@CanonNi', icon: 'medium', title: 'Medium' },
  { link: 'www.reddit.com/user/CanonNi/', icon: 'reddit', title: 'Reddit' },
  { link: 'steamcommunity.com/id/canonni/', icon: 'steam', title: 'Steam' },
  { link: 'www.tumblr.com/blog/canonni', icon: 'tumblr', title: 'Tumblr' },
  { link: 'x.com/canonnizq', icon: 'x', title: 'Twitter' },
  {
    link: 'meta.wikimedia.org/wiki/User:CanonNi',
    icon: 'wikimediafoundation',
    title: 'Wikimedia',
  },
  { link: 'www.youtube.com/@CanonNi', icon: 'youtube', title: 'YouTube' },
];

// Stat fields rendered on every card; values come from the feed routes in
// `src/lib/feeds`, and render as "—" when a platform has no route (yet).
const statFields: [keyof SocialStats, string][] = [
  ['followers', 'Followers'],
  ['posts', 'Posts'],
];

const resolveLink = (social: Social) =>
  social.override ? social.link : `https://${social.link}`;

// Simple Icons brand colors that are too dark to read on the dark background fall
// back to the light neutral tint, so the logo stays visible.
const brandTint = (hex: string) => {
  const value = parseInt(hex.slice(1), 16);
  const luminance =
    (0.2126 * ((value >> 16) & 255) + 0.7152 * ((value >> 8) & 255) + 0.0722 * (value & 255)) /
    255;
  return luminance < 1 ? '#dfd0b8' : hex;
};

// Neutral fallback shown while a brand color is still being fetched.
const FALLBACK_COLOR = '#948979';

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

export default function Socials() {
  const [active, setActive] = useState<number | null>(null);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<Record<string, SocialStats>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    socials.forEach(({ icon }) => {
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
    socials.forEach((social) => {
      getStats(social).then((result) => {
        if (!cancelled) {
          setStats((prev) => ({ ...prev, [social.title]: result }));
        }
      });
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
      {socials.map((social, index) => {
        const expanded = active === index;
        const panelId = `social-panel-${social.title.toLowerCase()}`;
        const brand = colors[social.icon] ?? FALLBACK_COLOR;
        const iconSrc = (tint: string) =>
          `https://cdn.simpleicons.org/${social.icon}/${tint}`;

        return (
          <div
            key={social.title}
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
              <span className={styles.label}>{social.title}</span>
            </button>

            <div id={panelId} className={styles.panel} aria-hidden={!expanded} inert={!expanded}>
              <div className={styles.panelInner}>
                <header className={styles.header}>
                  <div className={styles.logoWrap}>
                    <img className={styles.logo} height={44} src={iconSrc(brandTint(brand).slice(1))} alt="" />
                  </div>
                  <div className={styles.titleBlock}>
                    <a className={styles.title} href={resolveLink(social)} target="_blank" rel="noopener noreferrer">
                      {social.title} ↗
                    </a>
                    <p className={styles.note}>{social.link}</p>
                  </div>
                </header>

                <div className={styles.stats}>
                  {statFields.map(([key, label]) => (
                    <div key={key} className={styles.stat}>
                      <span className={styles.statLabel}>{label}</span>
                      <span className={styles.statValue}>{stats[social.title]?.[key] ?? '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
