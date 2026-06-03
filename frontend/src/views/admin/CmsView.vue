<script setup>
import { reactive, ref } from 'vue'
import { useQaAdminStore, QA_CATEGORIES } from '@/stores/qaAdmin'
import ImageUpload from '@/components/ui/ImageUpload.vue'

const store = useQaAdminStore()

const showForm = ref(false)
const editingId = ref(null)
const form = reactive(blankForm())

function blankForm() {
  return { category: QA_CATEGORIES[0], image: '', question: '', answer: '' }
}

function openCreate() {
  editingId.value = null
  Object.assign(form, blankForm())
  showForm.value = true
}

function openEdit(q) {
  editingId.value = q.id
  Object.assign(form, { category: q.category, image: q.image || '', question: q.question, answer: q.answer })
  showForm.value = true
}

function save() {
  if (!form.question || !form.answer) return
  if (editingId.value) store.update(editingId.value, { ...form })
  else store.create({ ...form })
  showForm.value = false
}

function remove(q) {
  if (confirm(`確定刪除「${q.question}」？`)) store.remove(q.id)
}
</script>

<template>
  <div class="qa-admin">
    <div class="head">
      <h1>Q&A 管理</h1>
      <div class="head__actions">
        <button class="btn--ghost btn" @click="store.resetToSeed()">重設示範資料</button>
        <button class="btn" @click="openCreate">＋ 新增 Q&A</button>
      </div>
    </div>
    <p class="hint">此處內容會直接顯示於前台「植栽養護 Q&A」知識庫。</p>

    <div class="qa-list">
      <article
        v-for="q in store.items"
        :key="q.id"
        class="qa-card"
        title="點此編輯"
        @click="openEdit(q)"
      >
        <img v-if="q.image" class="qa-thumb" :src="q.image" :alt="q.question" />
        <div class="qa-card__main">
          <span class="qa-cat">{{ q.category }}</span>
          <h3 class="qa-q">Q：{{ q.question }}</h3>
          <p class="qa-a">{{ q.answer }}</p>
        </div>
        <div class="qa-card__ops" @click.stop>
          <button class="link" @click="openEdit(q)">編輯</button>
          <button class="link danger" @click="remove(q)">刪除</button>
        </div>
      </article>
    </div>

    <!-- 新增 / 編輯 -->
    <div v-if="showForm" class="modal" @click.self="showForm = false">
      <div class="modal__card">
        <h2>{{ editingId ? '編輯 Q&A' : '新增 Q&A' }}</h2>
        <label>分類
          <select v-model="form.category">
            <option v-for="c in QA_CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
        <label>封面圖片</label>
        <ImageUpload v-model="form.image" />
        <label>問題 (Q)<input v-model="form.question" placeholder="請輸入問題" /></label>
        <label>回答 (A)<textarea v-model="form.answer" rows="6" placeholder="請輸入回答"></textarea></label>
        <div class="modal__actions">
          <button class="btn--ghost btn" @click="showForm = false">取消</button>
          <button class="btn" @click="save">{{ editingId ? '儲存' : '新增' }}</button>
        </div>
      </div>
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
.head__actions {
  display: flex;
  gap: 0.6rem;
}
.hint {
  color: var(--color-muted);
  font-size: 0.88rem;
  margin: 0.4rem 0 1.2rem;
}
.qa-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.qa-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius);
  padding: 1.1rem 1.2rem;
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;
}
.qa-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}
.qa-thumb {
  flex: 0 0 auto;
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 10px;
}
.qa-card__main {
  min-width: 0;
  flex: 1;
}
.qa-cat {
  display: inline-block;
  font-size: 0.74rem;
  color: var(--color-accent);
  letter-spacing: 0.04em;
  margin-bottom: 0.3rem;
}
.qa-q {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}
.qa-a {
  margin: 0;
  color: #4a514a;
  font-size: 0.9rem;
  line-height: 1.7;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.qa-card__ops {
  flex: 0 0 auto;
  white-space: nowrap;
}
.link {
  background: none;
  border: none;
  color: var(--color-primary);
  padding: 0 0.4rem;
}
.link.danger {
  color: #c0392b;
}

/* Modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(43, 53, 44, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 200;
}
.modal__card {
  background: var(--color-surface);
  border-radius: 14px;
  padding: 1.6rem;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal__card h2 {
  margin-top: 0;
}
.modal__card label {
  display: block;
  margin: 0.7rem 0 0.2rem;
  font-size: 0.88rem;
  color: var(--color-text);
}
.modal__card input,
.modal__card textarea,
.modal__card select {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  margin-top: 0.25rem;
  font: inherit;
}
.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1.4rem;
}

@media (max-width: 600px) {
  .qa-card {
    flex-direction: column;
  }
}
</style>
