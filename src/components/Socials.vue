<script setup>
const links = [
  ['x.com/canonnizq'],
  ['www.reddit.com/user/CanonNi/'],
  ['en.wikipedia.org/User:CanonNi'],
  ['www.youtube.com/@CanonNi'],
  ['space.bilibili.com/235513366'],
  ['discord.com/users/1195694156035674135'],
  ['steamcommunity.com/id/canonni/', 'steam'],
  ['github.com/canonnizq'],
  ['bsky.app/profile/canonni.website', 'bluesky'],
]

const re = /([^.]+)\.(\w+)\//
const socials = links.map((link) => {
  const slug = link[0].match(re)[1]

  return {
    url: 'https://' + link[0],
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    icon: link[1] || slug,
  }
})
</script>

<template>
  <div class="container">
    <a v-for="(social, index) in socials" :key="index" :href="social.url" class="social">
      <img :src="`https://cdn.simpleicons.org/${social.icon}/ebebeba3`" />
    </a>
  </div>
</template>

<style scoped>
.container {
  margin-top: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  gap: 1rem;
}

.social {
  width: 3.5rem;
  height: 3.5rem;
  padding: 0.5rem;
  border: 1px solid;
  border-radius: 1rem;
  color: inherit;
}
</style>
