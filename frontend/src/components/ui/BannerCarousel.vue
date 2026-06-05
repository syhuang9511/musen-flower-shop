<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  banners: { type: Array, default: () => [] },
  interval: { type: Number, default: 5000 },
})

const current = ref(0)
let timer = null

const count = computed(() => props.banners.length)

function go(i) {
  if (!count.value) return
  current.value = (i + count.value) % count.value
}
function next() {
  go(current.value + 1)
}
function prev() {
  go(current.value - 1)
}

function start() {
  stop()
  if (count.value > 1) timer = setInterval(next, props.interval)
}
function stop() {
  if (timer) clearInterval(timer)
  timer = null
}

function isExternal(link) {
  return typeof link === 'string' && /^https?:\/\//.test(link)
}

onMounted(start)
onBeforeUnmount(stop)
// 橫幅數量變動時，重置索引與計時器
watch(count, () => {
  if (current.value >= count.value) current.value = 0
  start()
})
</script>

<template>
  <section
    v-if="count"
    class="banner"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <div
      v-for="(b, i) in banners"
      :key="b.id ?? i"
      class="banner__slide"
      :class="{ active: current === i }"
      :style="{ backgroundImage: `linear-gradient(rgba(43,53,44,.4), rgba(43,53,44,.55)), url(${b.image})` }"
    >
      <div class="banner__caption">
        <p v-if="b.subtitle" class="banner__kicker">最新活動</p>
        <h2>{{ b.title }}</h2>
        <p v-if="b.subtitle" class="banner__sub">{{ b.subtitle }}</p>
        <a v-if="b.link && isExternal(b.link)" class="banner__btn" :href="b.link" target="_blank" rel="noopener">查看活動</a>
        <RouterLink v-else-if="b.link" class="banner__btn" :to="b.link">查看活動</RouterLink>
      </div>
    </div>

    <template v-if="count > 1">
      <button class="banner__nav prev" aria-label="上一張" @click="prev">‹</button>
      <button class="banner__nav next" aria-label="下一張" @click="next">›</button>
      <div class="banner__dots">
        <button
          v-for="(b, i) in banners"
          :key="b.id ?? i"
          class="banner__dot"
          :class="{ active: current === i }"
          :aria-label="`第 ${i + 1} 張`"
          @click="go(i)"
        ></button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.banner {
  position: relative;
  height: 340px;
  overflow: hidden;
}
.banner__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.7s ease;
  pointer-events: none;
}
.banner__slide.active {
  opacity: 1;
  pointer-events: auto;
}
.banner__caption {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  color: #fff;
}
.banner__kicker {
  margin: 0 0 0.5rem;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
}
.banner__caption h2 {
  margin: 0;
  font-size: 2rem;
  letter-spacing: 0.06em;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
}
.banner__sub {
  margin: 0.8rem 0 1.3rem;
  font-size: 1.02rem;
  color: rgba(255, 255, 255, 0.92);
  max-width: 540px;
  line-height: 1.7;
}
.banner__btn {
  display: inline-block;
  background: var(--color-primary);
  color: #fff;
  padding: 0.6rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.banner__btn:hover {
  background: var(--color-primary-dark);
}
.banner__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 1.6rem;
  line-height: 1;
  backdrop-filter: blur(4px);
}
.banner__nav:hover {
  background: rgba(255, 255, 255, 0.4);
}
.banner__nav.prev {
  left: 14px;
}
.banner__nav.next {
  right: 14px;
}
.banner__dots {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.banner__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  padding: 0;
}
.banner__dot.active {
  background: #fff;
  width: 22px;
  border-radius: 999px;
}

@media (max-width: 600px) {
  .banner {
    height: 240px;
  }
  .banner__caption {
    padding: 0 1.2rem;
  }
  .banner__caption h2 {
    font-size: 1.4rem;
  }
  .banner__sub {
    font-size: 0.9rem;
    margin: 0.6rem 0 1rem;
  }
  .banner__nav {
    display: none;
  }
}
</style>
