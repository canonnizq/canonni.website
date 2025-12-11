<script setup>
import Matrix from './components/Matrix.vue'
import Typewriter from './components/Typewriter.vue'
import Subdomains from './components/Subdomains.vue'
import Socials from './components/Socials.vue'
</script>

<template>
  <main>
    <div class="center">
      <!-- <Subdomains /> -->
      <Typewriter />
      <Socials />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100vh;

  user-select: none;
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.logos {
  height: 10rem;
  display: flex;
  opacity: 0.65;
  justify-content: center;
  margin-bottom: -5rem;
  margin-top: 5rem;
}
</style>
