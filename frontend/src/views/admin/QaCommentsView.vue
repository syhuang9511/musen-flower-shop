<script setup>
import { computed, reactive } from 'vue'
import { useQaSocialStore } from '@/stores/qaSocial'
import { useQaAdminStore } from '@/stores/qaAdmin'
import { useAdminAuthStore } from '@/stores/adminAuth'

const social = useQaSocialStore()
const qa = useQaAdminStore()
const admin = useAdminAuthStore()

// 每則留言對應的回覆草稿
const drafts = reactive({})

const list = computed(() => social.allComments)

function articleTitle(articleId) {
  return qa.items.find((q) => q.id === articleId)?.question || '（文章已刪除）'
}

function fmt(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(
    d.getDate(),
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function reply(commentId) {
  const body = (drafts[commentId] || '').trim()
  if (!body) return
  social.addReply(commentId, admin.current, body)
  drafts[commentId] = ''
}

function removeComment(c) {
  if (confirm(`確定刪除「${c.author}」的這則留言？回覆也會一併刪除。`)) {
    social.removeComment(c.id)
  }
}

function removeReply(commentId, replyId) {
  if (confirm('確定刪除這則回覆？')) social.removeReply(commentId, replyId)
}
</script>

<template>
  <div class="cm">
    <div class="head">
      <h1>留言管理</h1>
      <button class="btn--ghost btn" @click="social.resetToSeed()">重設示範留言</button>
    </div>
    <p class="hint">
      你目前以「<strong>{{ admin.current?.name }}</strong>（小編）」身分回覆。前台會員留言會即時顯示於此。
    </p>

    <p v-if="!list.length" class="empty">目前還沒有任何會員留言。</p>

    <div class="list">
      <article v-for="c in list" :key="c.id" class="card">
        <div class="card__top">
          <div>
            <span class="card__article">📄 {{ articleTitle(c.articleId) }}</span>
            <div class="card__author">
              <strong>{{ c.author }}</strong>
              <time>{{ fmt(c.createdAt) }}</time>
            </div>
          </div>
          <button class="link danger" @click="removeComment(c)">刪除留言</button>
        </div>

        <p class="card__body">{{ c.body }}</p>

        <!-- 既有回覆 -->
        <div v-for="r in c.replies" :key="r.id" class="reply">
          <div class="reply__head">
            <span class="reply__badge">小編 {{ r.adminName }}</span>
            <time>{{ fmt(r.createdAt) }}</time>
            <button class="link danger reply__del" @click="removeReply(c.id, r.id)">刪除</button>
          </div>
          <p class="reply__body">{{ r.body }}</p>
        </div>

        <!-- 回覆表單 -->
        <div class="reply-form">
          <textarea
            v-model="drafts[c.id]"
            rows="2"
            :placeholder="`以「小編 ${admin.current?.name}」身分回覆…`"
            @keyup.ctrl.enter="reply(c.id)"
          ></textarea>
          <button class="btn" :disabled="!(drafts[c.id] || '').trim()" @click="reply(c.id)">
            送出回覆
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
}
.hint {
  color: var(--color-muted);
  font-size: 0.88rem;
  margin: 0.4rem 0 1.4rem;
}
.empty {
  color: var(--color-muted);
}
.list {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius);
  padding: 1.1rem 1.2rem;
}
.card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}
.card__article {
  font-size: 0.78rem;
  color: var(--color-accent);
  letter-spacing: 0.03em;
}
.card__author {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-top: 0.25rem;
}
.card__author time {
  color: var(--color-muted);
  font-size: 0.78rem;
}
.card__body {
  margin: 0.7rem 0 0.9rem;
  line-height: 1.7;
  color: #3f463f;
}
.reply {
  margin: 0.6rem 0;
  padding: 0.7rem 0.9rem;
  background: #f1f4ef;
  border-left: 3px solid var(--color-primary);
  border-radius: 0 8px 8px 0;
}
.reply__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.reply__badge {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--color-primary);
}
.reply__head time {
  color: var(--color-muted);
  font-size: 0.76rem;
}
.reply__del {
  margin-left: auto;
}
.reply__body {
  margin: 0.3rem 0 0;
  line-height: 1.7;
  color: #3f463f;
}
.reply-form {
  display: flex;
  gap: 0.6rem;
  align-items: flex-end;
  margin-top: 0.8rem;
}
.reply-form textarea {
  flex: 1;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  font: inherit;
  resize: vertical;
}
.btn {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  font: inherit;
  cursor: pointer;
  white-space: nowrap;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn--ghost {
  background: transparent;
  color: var(--color-muted);
  border: 1px solid var(--color-line);
}
.link {
  background: none;
  border: none;
  color: var(--color-primary);
  padding: 0 0.3rem;
  cursor: pointer;
  font-size: 0.85rem;
}
.link.danger {
  color: #c0392b;
}
</style>
