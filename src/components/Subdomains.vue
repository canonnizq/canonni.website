<script>
export default {
  data() {
    return {
      subdomains: [
        { rel: 'blog', icon: 'edit_note' },
        { rel: 'gadgets', icon: 'handyman' },
        { rel: 'gallery', icon: 'photo_library' },
        { rel: 'dump', icon: 'delete' },
      ],
    }
  },
}
</script>

<template>
  <div class="container green monospace">
    <a
      v-for="(subdomain, index) in subdomains"
      :key="index"
      :href="`http://${subdomain.rel}.canonni.website`"
      class="link"
    >
      <span class="material-icons icon">{{ subdomain.icon }}</span>
      <span class="label">{{ subdomain.rel }}</span>
    </a>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.link {
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  border: 1px solid green;
  border-radius: 1rem;
  text-decoration: none;
  padding: 0.25rem;
}

.icon {
  font-size: 2rem;
}

.label {
  font-size: 1rem;
  margin-left: 0.5rem;
}
</style>
