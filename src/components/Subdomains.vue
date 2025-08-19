<script>
export default {
  data() {
    return {
      subdomains: ['blog', 'gadgets', 'gallery', '-'],
    }
  },
}
</script>

<template>
  <div class="container cursive">
    <a
      v-for="subdomain in subdomains"
      :key="index"
      :href="`https://${subdomain}.canonni.website`"
      class="link"
    >
      {{ subdomain }}
      <span class="dot">.</span>
    </a>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: -2.5rem;
}

.link {
  color: inherit;
  text-decoration: none;
  font-size: 2.5rem;
  margin-left: 0.5rem;

  border-radius: 1rem;
  transition: text-shadow 0.4s ease;
}
.link:hover {
  text-shadow: var(--background-subtle) 1rem 1rem 0.1rem;
}

.dot {
  font-size: 3rem;
  margin-left: -0.5rem;
}
</style>
