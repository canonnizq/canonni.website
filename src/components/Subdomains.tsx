import styles from '../styles/Subdomains.module.css';

export default function Subdomains() {
  const subdomains = ['blog', 'gadgets', 'gallery', '-'];

  return (
    <div className={`${styles.text} cursive`}>
      {subdomains.map((subdomain, index) => (
        <a key={index} href={`https://${subdomain}.canonni.website`} className={styles.link}>
          {subdomain}
          <span className={styles.dot}>.</span>
        </a>
      ))}
    </div>
  );
}
