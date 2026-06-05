<script setup>
import { computed, reactive, ref } from 'vue'
import { useBannerAdminStore, MAX_BANNERS } from '@/stores/bannerAdmin'
import ImageUpload from '@/components/ui/ImageUpload.vue'

const store = useBannerAdminStore()

const showForm = ref(false)
const editingId = ref(null)
const form = reactive(blankForm())

function blankForm() {
  return { image: '', title: '', subtitle: '', link: '/products', active: true }
}

function openCreate() {
  if (!store.canAdd) return
  editingId.value = null
  Object.assign(form, blankForm())
  showForm.value = true
}

function openEdit(b) {
  editingId.value = b.id
  Object.assign(form, {
    image: b.image || '',
    title: b.title || '',
    subtitle: b.subtitle || '',
    link: b.link || '',
    active: b.active,
  })
  showForm.value = true
}

function save() {
  if (!form.image || !form.title) return
  if (editingId.value) store.update(editingId.value, { ...form })
  else store.create({ ...form })
  showForm.value = false
}

function remove(b) {
  if (confirm(`確定刪除橫幅「${b.title}」？`)) store.remove(b.id)
}

const count = computed(() => store.items.length)
</script>

<template>
  <div class="banners">
    <div class="head">
      <h1>商品頁輪播管理</h1>
      <div class="head__actions">
        <button class="btn--ghost btn" @click="store.resetToSeed()">重設示範</button>
        <button class="btn" :disabled="!store.canAdd" @click="openCreate">＋ 新增橫幅</button>
      </div>
    </div>
    <p class="hint">
      顯示於前台「選購商品」頁頂的活動輪播。目前 <strong>{{ count }} / {{ MAX_BANNERS }}</strong> 張；
      可拖曳順序（用上下箭頭）、停用暫時隱藏。
    </p>

    <p v-if="!store.items.length" class="empty">尚無橫幅，點「新增橫幅」建立第一張。</p>

    <ul class="list">
      <li v-for="(b, idx) in store.items" :key="b.id" class="row" :class="{ off: !b.active }">
        <div class="order">
          <button class="ord" :disabled="idx === 0" @click="store.move(b.id, -1)" aria-label="上移">▲</button>
          <span class="ord__num">{{ idx + 1 }}</span>
          <button class="ord" :disabled="idx === count - 1" @click="store.move(b.id, 1)" aria-label="下移">▼</button>
        </div>
        <img class="thumb" :src="b.image" :alt="b.title" />
        <div class="info">
          <strong>{{ b.title }}</strong>
          <small>{{ b.subtitle }}</small>
          <small v-if="b.link" class="link-text">連結：{{ b.link }}</small>
        </div>
        <label class="switch" :title="b.active ? '已顯示' : '已隱藏'">
          <input type="checkbox" :checked="b.active" @change="store.update(b.id, { active: $event.target.checked })" />
          <span class="switch__track"><span class="switch__dot"></span></span>
        </label>
        <div class="ops">
          <button class="link" @click="openEdit(b)">編輯</button>
          <button class="link danger" @click="remove(b)">刪除</button>
        </div>
      </li>
    </ul>

    <!-- 新增 / 編輯 -->
    <div v-if="showForm" class="modal" @click.self="showForm = false">
      <div class="modal__card">
        <h2>{{ editingId ? '編輯橫幅' : '新增橫幅' }}</h2>
        <label>橫幅圖片（建議寬幅 1600×600）</label>
        <ImageUpload v-model="form.image" />
        <label>或貼上圖片網址
          <input v-model="form.image" placeholder="https://..." />
        </label>
        <label>主標題<input v-model="form.title" placeholder="例：母親節限定花禮" /></label>
        <label>副標題 / 活動說明
          <input v-model="form.subtitle" placeholder="例：滿 NT$1,000 折 100" />
        </label>
        <label>點擊連結（站內路徑或網址，可留空）
          <input v-model="form.link" placeholder="/products 或 https://..." />
        </label>
        <label class="inline"><input type="checkbox" v-model="form.active" /> 立即顯示於前台</label>
        <div class="modal__actions">
          <button class="btn--ghost btn" @click="showForm = false">取消</button>
          <button class="btn" :disabled="!form.image || !form.title" @click="save">
            {{ editingId ? '儲存' : '新增' }}
          </button>
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
.empty {
  color: var(--color-muted);
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius);
  padding: 0.7rem 0.9rem;
}
.row.off {
  opacity: 0.55;
}
.order {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}
.ord {
  border: none;
  background: none;
  color: var(--color-primary);
  font-size: 0.7rem;
  line-height: 1;
  padding: 0.15rem;
}
.ord:disabled {
  color: var(--color-line);
}
.ord__num {
  font-size: 0.8rem;
  color: var(--color-muted);
}
.thumb {
  width: 120px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex: 0 0 auto;
}
.info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.info small {
  color: var(--color-muted);
  font-size: 0.8rem;
}
.link-text {
  color: var(--color-accent) !important;
}
.ops {
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

/* 開關 */
.switch input {
  display: none;
}
.switch__track {
  display: inline-block;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: #d6d6d6;
  position: relative;
  transition: background 0.2s;
}
.switch__dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}
.switch input:checked + .switch__track {
  background: var(--color-primary);
}
.switch input:checked + .switch__track .switch__dot {
  transform: translateX(18px);
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
}
.modal__card label.inline {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
}
.modal__card input:not([type='checkbox']) {
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
  .row {
    flex-wrap: wrap;
  }
  .thumb {
    width: 90px;
    height: 50px;
  }
  .info {
    flex-basis: 60%;
  }
}
</style>
