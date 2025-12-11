<script setup>
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
  { link: 'meta.wikimedia.org/wiki/User:CanonNi', icon: 'wikimediafoundation', title: 'Wikimedia' },
  { link: 'www.youtube.com/@CanonNi', icon: 'youtube', title: 'YouTube' },
] // to future me: remember to sort alphabetically
</script>

<template>
  <div class="container">
    <a
      v-for="(social, index) in socials"
      :key="index"
      :href="social.override ? social.link : `https://${social.link}`"
      target="_blank"
      class="social"
    >
      <img height="15" :src="`https://cdn.simpleicons.org/${social.icon}/948979`" />
      <span class="label">{{ social.title }}</span>
    </a>
  </div>
</template>

<style scoped>
.container {
  color: var(--text-subtle);
  gap: 0.5rem;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  width: 45%;
  align-items: center;
  justify-content: center;
}
@media (max-width: 600px) {
  .container {
    width: 100%;
  }
}

.social {
  padding: 0 0.5rem;
  border: 1px solid;
  border-radius: 1rem;
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: box-shadow 0.4s ease;
}
.social:hover {
  box-shadow: var(--background-subtle) 0 0 5px 5px;
}

.label {
  margin-left: 0.25rem;
  font-size: 0.75rem;
}
</style>
