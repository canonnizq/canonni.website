<script setup>
import { onMounted, ref } from 'vue'

const interval = 100
const floor = 0x0020
const ceiling = 0xfeff

const characters = ref([])

onMounted(() => {
  setInterval(() => {
    const codePoint = Math.floor(Math.random() * (ceiling - floor + 1)) + floor
    const randomChar = String.fromCodePoint(codePoint)

    characters.value.push(randomChar)
    if (characters.value.length > 100) {
      characters.value.shift()
    }
  }, interval)
})
</script>

<template>
  <div class="column monospace">
    <span v-for="(char, index) in characters" :key="index" class="char">
      {{ char }}
    </span>
  </div>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  gap: 0.5rem;
}

.char {
  line-height: 1;
  text-align: center;
}
</style>
