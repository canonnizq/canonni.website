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
      <div class="logos">
        <img src="/img/lipu.svg" />
        <img src="/img/kamapona.svg" />
      </div>
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

.logos {
  height: 10rem;
  display: flex;
  opacity: 0.65;
  justify-content: center;
  margin-bottom: -5rem;
  margin-top: 5rem;
}
</style>
