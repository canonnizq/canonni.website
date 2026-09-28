import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from '../styles/Socials.module.css';

interface Social {
  link: string;
  icon: string;
  title: string;
  color: string;
  override?: boolean;
}

const socials: Social[] = [
  { link: 'space.bilibili.com/235513366', icon: 'bilibili', title: 'Bilibili', color: '#00a1d6' },
  { link: 'bsky.app/profile/canonni.website', icon: 'bluesky', title: 'Bluesky', color: '#0285ff' },
  { link: 'discord.com/users/1195694156035674135', icon: 'discord', title: 'Discord', color: '#5865f2' },
  { link: 'mailto:canonnizq@gmail.com', icon: 'mail.ru', title: 'Email', color: '#948979', override: true },
  { link: 'www.flickr.com/photos/200807288@N06/', icon: 'flickr', title: 'Flickr', color: '#ff0084' },
  { link: 'github.com/canonnizq', icon: 'github', title: 'GitHub', color: '#181717' },
  { link: 'www.instagram.com/canonnizq/', icon: 'instagram', title: 'Insta', color: '#e4405f' },
  { link: 'mastodon.social/@CanonNi', icon: 'mastodon', title: 'Masto', color: '#6364ff' },
  { link: 'medium.com/@CanonNi', icon: 'medium', title: 'Medium', color: '#000000' },
  { link: 'www.reddit.com/user/CanonNi/', icon: 'reddit', title: 'Reddit', color: '#ff4500' },
  { link: 'steamcommunity.com/id/canonni/', icon: 'steam', title: 'Steam', color: '#000000' },
  { link: 'www.tumblr.com/blog/canonni', icon: 'tumblr', title: 'Tumblr', color: '#36465d' },
  { link: 'x.com/canonnizq', icon: 'x', title: 'Twitter', color: '#000000' },
  {
    link: 'meta.wikimedia.org/wiki/User:CanonNi',
    icon: 'wikimediafoundation',
    title: 'Wikimedia',
    color: '#000000',
  },
  { link: 'www.youtube.com/@CanonNi', icon: 'youtube', title: 'YouTube', color: '#ff0000' },
];

// Placeholder stats — these will later be replaced by live data pulled from each
// platform's RSS feed.
const statPlaceholders = ['Followers', 'Posts'];

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

export default function Socials() {
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
        const iconSrc = (tint: string) =>
          `https://cdn.simpleicons.org/${social.icon}/${tint}`;

        return (
          <div
            key={social.title}
            style={
              {
                '--brand': social.color,
                '--brand-text': brandTint(social.color),
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
                    <img className={styles.logo} height={44} src={iconSrc(brandTint(social.color).slice(1))} alt="" />
                  </div>
                  <div className={styles.titleBlock}>
                    <a className={styles.title} href={resolveLink(social)} target="_blank" rel="noopener noreferrer">
                      {social.title} ↗
                    </a>
                    <p className={styles.note}>{social.link}</p>
                  </div>
                </header>

                <div className={styles.stats}>
                  {statPlaceholders.map((label) => (
                    <div key={label} className={styles.stat}>
                      <span className={styles.statLabel}>{label}</span>
                      <span className={styles.statValue}>—</span>
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
