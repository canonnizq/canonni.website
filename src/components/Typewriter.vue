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
  '13641667828',
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
    <a href="." class="domain">
      <span class="tooltip left">Yup, that's an actual TLD.</span>
      <span class="tld">.website</span>
      <span class="tooltip right">Pretty apt for a website, huh?</span>
    </a>
    <span class="links">
      <a href="https://github.com/canonnizq/canonni.website">source</a>&bull;
      <a href="https://afdian.com/a/canonni">sponsor</a>
    </span>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

a {
  color: inherit;
}

.typewriter {
  font-size: 5rem;
  white-space: nowrap;
  display: inline-block;
  position: relative;
  margin-bottom: -4.5rem;
  font-weight: bold;
}

.domain {
  font-size: 3.5rem;
  text-decoration: none;
  display: inline-block;
  position: relative;
  text-align: center;
  margin-top: 2rem;
}
.domain .tld {
  position: relative;
}

.domain .tooltip {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--background-subtle);
  color: var(--text-normal);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 1rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 1s ease;
}
.domain:hover .tooltip {
  opacity: 0.75;
}

.tooltip.left {
  left: -100%;
  margin-right: 1rem;
}
.tooltip.right {
  right: -120%;
  margin-left: 1rem;
}

.links {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -1rem;
  gap: 0.5rem;

  font-size: 1.5rem;
  color: var(--text-subtle);
}
.links a {
  padding: 0rem 0.5rem;
  text-decoration: none;
  transition: text-shadow 0.4s ease;
}
.links a:hover {
  text-shadow: var(--background-subtle) 0.5rem 0.5rem 0.1rem;
}

.cursor {
  position: absolute;
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
</style>
