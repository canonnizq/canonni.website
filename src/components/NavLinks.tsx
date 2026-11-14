import styles from '../styles/NavLinks.module.css';

/**
 * The two subdomains, as pill buttons above the typewriter.
 *
 * Both links carry a decorative `fx` layer: an animated backdrop that stays
 * invisible until the link is hovered or focused. The effects are intentionally
 * different — a drifting warm aurora for the blog, a radar sweep with expanding
 * pings for the geocaching subdomain — while sticking to the site's palette.
 */
export default function NavLinks() {
  return (
    <nav className={styles.links} aria-label="Subdomains">
      <a
        className={`${styles.link} ${styles.blog}`}
        href="https://blog.canonni.website"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.fx} aria-hidden="true">
          <span className={styles.aurora} />
          <span className={styles.sheen} />
        </span>
        <span className={styles.label}>blog</span>
      </a>

      <a
        className={`${styles.link} ${styles.geocaching}`}
        href="https://geocaching.canonni.website"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.fx} aria-hidden="true">
          <span className={styles.radar} />
          <span className={styles.ping} />
          <span className={`${styles.ping} ${styles.pingTwo}`} />
          <span className={styles.blip} />
        </span>
        <span className={styles.label}>geocaching</span>
      </a>
    </nav>
  );
}
