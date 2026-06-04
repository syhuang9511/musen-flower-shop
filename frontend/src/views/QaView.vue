<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useQaAdminStore } from '@/stores/qaAdmin'
import { useQaSocialStore } from '@/stores/qaSocial'

const store = useQaAdminStore()
const social = useQaSocialStore()
const keyword = ref('')
const activeCat = ref('全部')

const cats = computed(() => ['全部', ...store.categories])

const results = computed(() => {
  let list = store.search(keyword.value)
  if (activeCat.value !== '全部') list = list.filter((q) => q.category === activeCat.value)
  return list
})

function excerpt(text) {
  const first = text.split('\n').find((l) => l.trim()) || text
  return first.length > 70 ? first.slice(0, 70) + '…' : first
}
</script>

<template>
  <div class="qa">
    <!-- 部落格式封面 -->
    <header class="qa-hero">
      <div class="container qa-hero__inner">
        <p class="qa-hero__kicker">MUSEN ㅤ植感日誌</p>
        <h1>植栽養護 Q&A 知識庫</h1>
        <p class="qa-hero__sub">從澆水、光照到施肥，陪你把每一株植物都照顧得好好的。</p>
      </div>
    </header>

    <div class="container qa-body">
      <!-- 搜尋 + 分類 -->
      <div class="qa-toolbar">
        <input v-model="keyword" class="qa-search" placeholder="搜尋：澆水、散射光、施肥、蘭花…" />
        <nav class="qa-cats">
          <button
            v-for="c in cats"
            :key="c"
            class="qa-cat-tab"
            :class="{ active: activeCat === c }"
            @click="activeCat = c"
          >
            {{ c }}
          </button>
        </nav>
      </div>

      <p v-if="!results.length" class="notice">找不到相關文章，換個關鍵字或分類試試。</p>

      <!-- 文章卡片 -->
      <div class="posts">
        <RouterLink
          v-for="q in results"
          :key="q.id"
          :to="`/qa/${q.id}`"
          class="post"
        >
          <div class="post__media">
            <img :src="q.image" :alt="q.question" loading="lazy" />
            <span class="post__cat">{{ q.category }}</span>
          </div>
          <div class="post__body">
            <h2 class="post__title">{{ q.question }}</h2>
            <p class="post__excerpt">{{ excerpt(q.answer) }}</p>
            <div class="post__foot">
              <span class="post__stat">❤️ {{ social.likeCount(q.id) }}</span>
              <span class="post__stat">💬 {{ social.commentCount(q.id) }}</span>
              <span class="post__more">閱讀更多 →</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 封面 */
.qa-hero {
  position: relative;
  color: #fff;
  background:
    linear-gradient(rgba(43, 53, 44, 0.55), rgba(43, 53, 44, 0.65)),
    url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=60')
      center / cover;
  padding: 4.5rem 0;
  text-align: center;
}
.qa-hero__kicker {
  margin: 0 0 0.6rem;
  letter-spacing: 0.3em;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}
.qa-hero h1 {
  margin: 0;
  font-size: 2rem;
  letter-spacing: 0.08em;
}
.qa-hero__sub {
  margin: 0.7rem 0 0;
  color: rgba(255, 255, 255, 0.85);
}

.qa-body {
  padding: 2.2rem 1rem 3rem;
  max-width: 920px;
}

/* 工具列 */
.qa-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem 1.2rem;
  margin-bottom: 1.8rem;
}
.qa-search {
  flex: 1 1 260px;
  padding: 0.7rem 1rem;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  font: inherit;
}
.qa-cats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.qa-cat-tab {
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  transition: all 0.18s;
}
.qa-cat-tab:hover {
  border-color: var(--color-primary);
}
.qa-cat-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

/* 文章卡片 */
.posts {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}
.post {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.4rem;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--shadow);
  color: inherit;
  text-decoration: none;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
}
.post:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}
.post__media {
  position: relative;
  min-height: 200px;
}
.post__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.post__cat {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  background: rgba(43, 53, 44, 0.78);
  color: #fff;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
}
.post__body {
  padding: 1.4rem 1.4rem 1.4rem 0;
  display: flex;
  flex-direction: column;
}
.post__title {
  margin: 0 0 0.6rem;
  font-size: 1.18rem;
  line-height: 1.5;
}
.post__excerpt {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.7;
}
.post__foot {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
}
.post__stat {
  font-size: 0.85rem;
  color: var(--color-muted);
}
.post__more {
  margin-left: auto;
  color: var(--color-primary);
  font-weight: 600;
  letter-spacing: 0.03em;
  font-size: 0.9rem;
}

@media (max-width: 680px) {
  .post {
    grid-template-columns: 1fr;
  }
  .post__media {
    min-height: 0;
    aspect-ratio: 16 / 9;
  }
  .post__body {
    padding: 1.2rem;
  }
}
</style>
