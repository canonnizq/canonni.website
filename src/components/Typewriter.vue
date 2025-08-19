<script setup>
import { onMounted, ref } from 'vue'

const fullTexts = [
  'CanonNi',
  'canonnizq',
  'Ni Zeqing',
  '倪泽青',
  'CNZQ',
  'Pongo sapiens',
  'Kinney',
  'BI4APQ',
  '{{title.text}}',
]

const displayedText = ref('')
const typingSpeed = 100

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

onMounted(() => {
  let letter_idx = 0
  let currentText = ''

  let order = shuffle([...fullTexts])
  let order_idx = 0

  const type = () => {
    if (letter_idx == 0) {
      currentText = order[order_idx]
      order_idx++

      if (order_idx >= order.length) {
        order = shuffle([...fullTexts])
        order_idx = 0
      }

      displayedText.value = ''
    }

    if (letter_idx < currentText.length) {
      displayedText.value += currentText[letter_idx]
      letter_idx++
      setTimeout(type, typingSpeed)
    } else {
      letter_idx = 0
      setTimeout(type, typingSpeed * 10)
    }
  }

  type()
})
</script>

<template>
  <div class="container monospace">
    <span class="typewriter">
      {{ displayedText }}
      <span class="cursor">|</span>
    </span>
    <div class="domain">
      <span class="tooltip">Yup, that's an actual TLD.</span>
      <span class="middle">
        <span class="tld">.website</span>
        <span class="links">
          <a target="_blank" href="https://github.com/canonnizq/canonni.website">source</a>&bull;
          <a target="_blank" href="https://afdian.com/a/canonni">sponsor</a>
        </span>
      </span>
      <span class="tooltip">Pretty apt for a website, huh?</span>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.typewriter {
  font-size: 5rem;
  margin-bottom: -4.5rem;
  font-weight: bold;
  display: flex;
  text-align: center;
}
.typewriter .cursor {
  animation: blink 1s infinite;
  right: -0.5em;
  top: 0;
}
@keyframes blink {
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.domain {
  font-size: 3.5rem;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.domain .tooltip {
  background-color: var(--background-subtle);
  color: var(--text-normal);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 1rem;
  opacity: 0;
  transition: opacity 1s ease;
  height: fit-content;
}
.domain:has(.tld:hover) .tooltip {
  opacity: 0.75;
}
@media (max-width: 768px) {
  .tooltip {
    display: none;
  }
}

.domain .middle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.links {
  display: flex;
  margin-top: -1rem;
  gap: 0.5rem;

  font-size: 1.5rem;
  color: var(--text-subtle);
}
.links a {
  color: inherit;
  padding: 0rem 0.5rem;
  text-decoration: none;
  transition: text-shadow 0.4s ease;
}
.links a:hover {
  text-shadow: var(--background-subtle) 0.5rem 0.5rem 0.1rem;
}
</style>
