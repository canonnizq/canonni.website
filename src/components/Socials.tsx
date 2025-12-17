import styles from '../styles/Socials.module.css';

export default function Socials() {
  const socials = [
    { link: 'space.bilibili.com/235513366', icon: 'bilibili', title: 'Bilibili' },
    { link: 'bsky.app/profile/canonni.website', icon: 'bluesky', title: 'Bluesky' },
    { link: 'discord.com/users/1195694156035674135', icon: 'discord', title: 'Discord' },
    { link: 'mailto:canonnizq@gmail.com', icon: 'mail.ru', title: 'Email', override: true },
    { link: 'www.flickr.com/photos/200807288@N06/', icon: 'flickr', title: 'Flickr' },
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

  return (
    <div className={styles.container}>
      {socials.map((social, index) => (
        <a
          key={index}
          href={social.override ? social.link : `https://${social.link}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <img
            height={15}
            src={`https://cdn.simpleicons.org/${social.icon}/948979`}
            alt={social.title}
          />
          <span className={styles.label}>{social.title}</span>
        </a>
      ))}
    </div>
  );
}
