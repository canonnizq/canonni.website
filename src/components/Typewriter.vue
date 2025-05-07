<script setup>
import { onMounted, ref } from 'vue'

const fullTexts = ['CanonNi', 'canonnizq', 'Ni Zeqing', '倪泽青', 'Pongo sapiens', 'Kinney']
const displayedText = ref('')
const typingSpeed = 100

onMounted(() => {
  let text_idx = 0
  let letter_idx = 0

  const type = () => {
    const currentText = fullTexts[text_idx % fullTexts.length]

    if (letter_idx == 0) {
      displayedText.value = ''
    }

    if (letter_idx < currentText.length) {
      displayedText.value += currentText[letter_idx]
      letter_idx++
      setTimeout(type, typingSpeed)
    } else {
      letter_idx = 0
      text_idx++
      setTimeout(type, typingSpeed * 10)
    }
  }

  type()
})
</script>

<template>
  <div class="container green monospace">
    <span class="typewriter">
      {{ displayedText }}
      <span class="cursor">|</span>
    </span>
    <a href="." class="domain">
      <span class="tooltip left">Yes; that's an actual TLD.</span>
      <span class="tld">.website</span>
      <span class="tooltip right">...pretty apt for a website, huh?</span>
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
  height: 50vh;
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
  background-color: rgba(0, 189, 126, 0.25);
  color: #fff;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 1rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}
.domain:hover .tooltip {
  opacity: 0.75;
}

.tooltip.left {
  left: -100%;
  margin-right: 1rem;
}
.tooltip.right {
  right: -130%;
  margin-left: 1rem;
}

.links {
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -1rem;
  gap: 0.5rem;
}

.links a {
  padding: 0.25rem 0.25rem;
  text-decoration: none;
  border: 2px solid transparent;
  border-radius: 2rem;
  transition: background-color 0.4s ease;
  position: relative;
}
.links a:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
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
