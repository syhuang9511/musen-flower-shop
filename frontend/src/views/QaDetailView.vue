<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useQaAdminStore } from '@/stores/qaAdmin'
import { useQaSocialStore } from '@/stores/qaSocial'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const props = defineProps({ id: { type: [String, Number], required: true } })

const qa = useQaAdminStore()
const social = useQaSocialStore()
const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const articleId = computed(() => Number(props.id))
const article = computed(() => qa.items.find((q) => q.id === articleId.value))

// 同分類的其他文章（最多 3 篇）作為「延伸閱讀」
const related = computed(() =>
  qa.items
    .filter((q) => q.id !== articleId.value && q.category === article.value?.category)
    .slice(0, 3),
)

const comments = computed(() => social.commentsFor(articleId.value))

const draft = ref('')

function toggleLike() {
  social.toggleLike(articleId.value)
}

function submitComment() {
  const body = draft.value.trim()
  if (!body) return
  social.addComment(articleId.value, auth.user?.name || auth.user?.email, body)
  draft.value = ''
  toast.show('留言已送出，感謝你的分享！')
}

function fmt(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(
    d.getDate(),
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function initial(name) {
  return (name || '?').charAt(0).toUpperCase()
}
</script>

<template>
  <article v-if="article" class="post">
    <!-- 文章封面 -->
    <header
      class="post-hero"
      :style="{ backgroundImage: `linear-gradient(rgba(43,53,44,.45),rgba(43,53,44,.7)), url(${article.image})` }"
    >
      <div class="container post-hero__inner">
        <RouterLink to="/qa" class="post-hero__back">← 回植栽養護日誌</RouterLink>
        <span class="post-hero__cat">{{ article.category }}</span>
        <h1>{{ article.question }}</h1>
        <p class="post-hero__meta">MUSEN 植感日誌 · 沐森植研所</p>
      </div>
    </header>

    <div class="container post-body">
      <!-- 內文 -->
      <div class="post-content">{{ article.answer }}</div>

      <!-- 點讚 -->
      <div class="like-bar">
        <button class="like-btn" :class="{ liked: social.hasLiked(articleId) }" @click="toggleLike">
          <span class="like-btn__heart">{{ social.hasLiked(articleId) ? '❤️' : '🤍' }}</span>
          <span>{{ social.hasLiked(articleId) ? '已喜歡' : '喜歡這篇' }}</span>
          <span class="like-btn__count">{{ social.likeCount(articleId) }}</span>
        </button>
        <p class="like-bar__hint">覺得有幫助嗎？幫這篇養護筆記按個讚吧 🌱</p>
      </div>

      <!-- 延伸閱讀 -->
      <section v-if="related.length" class="related">
        <h3>延伸閱讀</h3>
        <ul>
          <li v-for="r in related" :key="r.id">
            <RouterLink :to="`/qa/${r.id}`">{{ r.question }}</RouterLink>
          </li>
        </ul>
      </section>

      <!-- 留言區 -->
      <section class="comments">
        <h2 class="comments__title">會員留言 <span>({{ comments.length }})</span></h2>

        <!-- 留言表單 -->
        <div v-if="auth.isLoggedIn" class="comment-form">
          <span class="avatar">{{ initial(auth.user?.name) }}</span>
          <div class="comment-form__main">
            <textarea
              v-model="draft"
              rows="3"
              placeholder="分享你的養護心得或提出問題…"
              @keyup.ctrl.enter="submitComment"
            ></textarea>
            <div class="comment-form__actions">
              <small>以「{{ auth.user?.name || auth.user?.email }}」會員身分留言</small>
              <button class="btn" :disabled="!draft.trim()" @click="submitComment">送出留言</button>
            </div>
          </div>
        </div>
        <div v-else class="comment-login">
          <p>登入會員後即可留言與小編互動。</p>
          <RouterLink class="btn" :to="{ name: 'login', query: { redirect: `/qa/${articleId}` } }">
            登入 / 註冊
          </RouterLink>
        </div>

        <!-- 留言列表 -->
        <p v-if="!comments.length" class="comments__empty">還沒有留言，成為第一個分享的人吧！</p>
        <ul class="comment-list">
          <li v-for="c in comments" :key="c.id" class="comment">
            <span class="avatar">{{ initial(c.author) }}</span>
            <div class="comment__main">
              <div class="comment__head">
                <strong>{{ c.author }}</strong>
                <time>{{ fmt(c.createdAt) }}</time>
              </div>
              <p class="comment__body">{{ c.body }}</p>

              <!-- 管理員回覆 -->
              <div v-for="r in c.replies" :key="r.id" class="reply">
                <span class="reply__badge">小編 {{ r.adminName }}</span>
                <p class="reply__body">{{ r.body }}</p>
                <time>{{ fmt(r.createdAt) }}</time>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </article>

  <!-- 找不到文章 -->
  <div v-else class="container missing">
    <h1>找不到這篇文章</h1>
    <p>它可能已被移除或網址有誤。</p>
    <button class="btn" @click="router.push('/qa')">回植栽養護日誌</button>
  </div>
</template>

<style scoped>
/* 封面 */
.post-hero {
  color: #fff;
  background-size: cover;
  background-position: center;
  padding: 4.5rem 0 3rem;
}
.post-hero__inner {
  max-width: 820px;
}
.post-hero__back {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
}
.post-hero__back:hover {
  color: #fff;
}
.post-hero__cat {
  display: inline-block;
  margin: 1.4rem 0 0.6rem;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  font-size: 0.78rem;
  letter-spacing: 0.05em;
}
.post-hero h1 {
  margin: 0;
  font-size: 1.9rem;
  line-height: 1.5;
  letter-spacing: 0.03em;
}
.post-hero__meta {
  margin: 0.9rem 0 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
}

.post-body {
  max-width: 760px;
  padding: 2.4rem 1rem 3.5rem;
}
.post-content {
  color: #3f463f;
  line-height: 2;
  font-size: 1.04rem;
  white-space: pre-line;
}

/* 點讚 */
.like-bar {
  text-align: center;
  margin: 2.6rem 0;
  padding: 1.8rem 0;
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
}
.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.4rem;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  background: var(--color-surface);
  font-size: 1rem;
  transition: all 0.18s;
}
.like-btn:hover {
  border-color: var(--color-primary);
}
.like-btn.liked {
  border-color: #e2738a;
  background: #fdeef1;
  color: #c0392b;
}
.like-btn__heart {
  font-size: 1.15rem;
}
.like-btn__count {
  font-weight: 700;
  margin-left: 0.2rem;
}
.like-bar__hint {
  margin: 0.8rem 0 0;
  color: var(--color-muted);
  font-size: 0.85rem;
}

/* 延伸閱讀 */
.related {
  margin-bottom: 2.6rem;
}
.related h3 {
  margin: 0 0 0.6rem;
  font-size: 1rem;
}
.related ul {
  margin: 0;
  padding-left: 1.1rem;
}
.related li {
  margin: 0.3rem 0;
}
.related a {
  color: var(--color-primary);
}

/* 留言 */
.comments__title {
  font-size: 1.25rem;
  margin: 0 0 1.2rem;
}
.comments__title span {
  color: var(--color-muted);
  font-size: 1rem;
}
.comments__empty {
  color: var(--color-muted);
}
.avatar {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
.comment-form {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.8rem;
}
.comment-form__main {
  flex: 1;
}
.comment-form textarea {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--color-line);
  border-radius: 10px;
  font: inherit;
  resize: vertical;
}
.comment-form__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  gap: 0.8rem;
}
.comment-form__actions small {
  color: var(--color-muted);
}
.comment-login {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.8rem;
  background: var(--color-surface);
  border: 1px dashed var(--color-line);
  border-radius: 12px;
  padding: 1.1rem 1.3rem;
  margin-bottom: 1.8rem;
}
.comment-login p {
  margin: 0;
  color: var(--color-muted);
}

.comment-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}
.comment {
  display: flex;
  gap: 0.8rem;
}
.comment__main {
  flex: 1;
  min-width: 0;
}
.comment__head {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  margin-bottom: 0.3rem;
}
.comment__head time {
  color: var(--color-muted);
  font-size: 0.8rem;
}
.comment__body {
  margin: 0;
  line-height: 1.7;
  color: #3f463f;
}
.reply {
  margin-top: 0.7rem;
  padding: 0.7rem 0.9rem;
  background: #f1f4ef;
  border-left: 3px solid var(--color-primary);
  border-radius: 0 8px 8px 0;
}
.reply__badge {
  display: inline-block;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}
.reply__body {
  margin: 0 0 0.3rem;
  line-height: 1.7;
  color: #3f463f;
}
.reply time {
  color: var(--color-muted);
  font-size: 0.76rem;
}

.btn {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.2rem;
  font: inherit;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.missing {
  text-align: center;
  padding: 5rem 1rem;
}

@media (max-width: 600px) {
  .post-hero h1 {
    font-size: 1.45rem;
  }
}
</style>
