<script setup>
import Matrix from './components/Matrix.vue'
import Typewriter from './components/Typewriter.vue'
import Subdomains from './components/Subdomains.vue'
import Socials from './components/Socials.vue'
</script>

<template>
  <main>
    <Matrix />
    <div class="center">
      <Typewriter />
      <Subdomains />
      <Socials />
    </div>
    <Matrix />
  </main>
</template>

<style scoped>
main {
  display: flex;
  overflow: hidden;
  flex-direction: row;
  justify-content: space-between;
}

.center {
  display: flex;
  flex-direction: column;
}
</style>
