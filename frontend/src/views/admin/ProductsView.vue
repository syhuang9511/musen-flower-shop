<script setup>
import { reactive, ref } from 'vue'
import { useProductAdminStore } from '@/stores/productAdmin'
import { useCategoryStore } from '@/stores/category'
import { LogisticsClass } from '@/stores/cart'
import ImageUpload from '@/components/ui/ImageUpload.vue'

const store = useProductAdminStore()
const categoryStore = useCategoryStore()

const logisticsLabels = {
  [LogisticsClass.GENERAL]: '一般資材（可超商/宅配）',
  [LogisticsClass.BULKY]: '大型盆栽（限專人貨車）',
  [LogisticsClass.FRAGILE]: '高脆弱鮮花（限專人貨車）',
}

const showForm = ref(false)
const editingId = ref(null)
const form = reactive(blankForm())

function blankForm() {
  return {
    name: '',
    category: categoryStore.categories[0] || '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    logisticsClass: LogisticsClass.GENERAL,
    featured: false,
    active: true,
  }
}

function openCreate() {
  editingId.value = null
  Object.assign(form, blankForm())
  showForm.value = true
}

function openEdit(p) {
  editingId.value = p.id
  Object.assign(form, {
    name: p.name,
    category: p.category || categoryStore.categories[0] || '',
    description: p.description,
    price: p.price,
    stock: p.stock,
    image: p.image,
    logisticsClass: p.logisticsClass,
    featured: p.featured,
    active: p.active,
  })
  showForm.value = true
}

function save() {
  if (!form.name || form.price < 0) return
  const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
  // ⬇︎ 後端就緒後改為：editingId.value ? adminProductApi.update(...) : adminProductApi.create(...)
  if (editingId.value) {
    store.update(editingId.value, payload)
  } else {
    store.create(payload)
  }
  showForm.value = false
}

function remove(p) {
  if (confirm(`確定刪除「${p.name}」？`)) store.remove(p.id)
}

// ---- 分類管理 ----
const showCatModal = ref(false)
const newCat = ref('')

function addCategory() {
  if (categoryStore.add(newCat.value)) newCat.value = ''
}
function removeCategory(name) {
  if (confirm(`刪除分類「${name}」？（已套用此分類的商品不會被刪除，但會失去分類）`)) {
    categoryStore.remove(name)
  }
}
</script>

<template>
  <div class="admin-products">
    <div class="head">
      <h1>商品管理</h1>
      <div class="head__actions">
        <button class="btn--ghost btn" @click="store.resetToSeed()">重設示範資料</button>
        <button class="btn--ghost btn" @click="showCatModal = true">管理分類</button>
        <button class="btn" @click="openCreate">＋ 上架新商品</button>
      </div>
    </div>

    <div class="ptable">
      <!-- 表頭與每一列共用同一組 grid 欄位，對齊有保證 -->
      <div class="ptable__head">
        <div>商品</div>
        <div>價格</div>
        <div>庫存</div>
        <div>物流類別</div>
        <div class="ta-c">主打</div>
        <div>狀態</div>
        <div>操作</div>
      </div>

      <div
        v-for="p in store.products"
        :key="p.id"
        class="ptable__row"
        :class="{ inactive: !p.active }"
        title="點此列可編輯"
        @click="openEdit(p)"
      >
        <div class="cell-name">
          <img :src="p.image" :alt="p.name" />
          <div class="cell-name__text">
            <span class="cell-name__title">{{ p.name }}</span>
            <small v-if="p.category" class="cell-name__cat">{{ p.category }}</small>
          </div>
        </div>
        <div data-label="價格">NT$ {{ p.price }}</div>
        <div data-label="庫存">{{ p.stock }}</div>
        <div data-label="物流類別">
          <span class="tag" :data-cls="p.logisticsClass">{{ logisticsLabels[p.logisticsClass] }}</span>
        </div>
        <div class="cell-switch ta-c" data-label="主打" @click.stop>
          <label class="switch" :title="p.featured ? '取消主打' : '設為主打'">
            <input type="checkbox" :checked="p.featured" @change="store.toggleFeatured(p.id)" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="cell-switch" data-label="狀態" @click.stop>
          <label class="switch" :title="p.active ? '點此下架' : '點此上架'">
            <input type="checkbox" :checked="p.active" @change="store.toggleActive(p.id)" />
            <span class="slider"></span>
          </label>
          <span :class="['status', p.active ? 'on' : 'off']">{{ p.active ? '上架中' : '已下架' }}</span>
        </div>
        <div class="cell-ops">
          <button class="link" @click.stop="openEdit(p)">編輯</button>
          <button class="link danger" @click.stop="remove(p)">刪除</button>
        </div>
      </div>
    </div>

    <!-- 新增 / 編輯表單 -->
    <div v-if="showForm" class="modal" @click.self="showForm = false">
      <div class="modal__card">
        <h2>{{ editingId ? '編輯商品' : '上架新商品' }}</h2>
        <label>商品名稱<input v-model="form.name" /></label>
        <label>商品分類
          <select v-model="form.category">
            <option v-for="c in categoryStore.categories" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
        <label>商品描述<textarea v-model="form.description" rows="2"></textarea></label>
        <div class="row">
          <label>價格 (NT$)<input v-model.number="form.price" type="number" min="0" /></label>
          <label>庫存<input v-model.number="form.stock" type="number" min="0" /></label>
        </div>
        <label>商品圖片</label>
        <ImageUpload v-model="form.image" />
        <label>物流類別
          <select v-model="form.logisticsClass">
            <option v-for="(label, key) in logisticsLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </label>
        <div class="row switches">
          <div class="switch-field">
            <label class="switch">
              <input type="checkbox" v-model="form.featured" />
              <span class="slider"></span>
            </label>
            <span>設為首頁主打</span>
          </div>
          <div class="switch-field">
            <label class="switch">
              <input type="checkbox" v-model="form.active" />
              <span class="slider"></span>
            </label>
            <span>{{ form.active ? '上架中' : '已下架' }}</span>
          </div>
        </div>
        <div class="modal__actions">
          <button class="btn--ghost btn" @click="showForm = false">取消</button>
          <button class="btn" @click="save">{{ editingId ? '儲存' : '上架' }}</button>
        </div>
      </div>
    </div>

    <!-- 分類管理 -->
    <div v-if="showCatModal" class="modal" @click.self="showCatModal = false">
      <div class="modal__card">
        <h2>商品分類管理</h2>
        <p class="hint">這裡新增的分類會出現在「上架商品」的分類選單，以及前台商品列表的分類頁籤。</p>

        <div class="cat-add">
          <input v-model="newCat" placeholder="輸入新分類名稱" @keyup.enter="addCategory" />
          <button class="btn" @click="addCategory">新增</button>
        </div>

        <ul class="cat-list">
          <li v-for="c in categoryStore.categories" :key="c">
            <input
              class="cat-name"
              :value="c"
              @change="(e) => categoryStore.rename(c, e.target.value)"
            />
            <button class="link danger" @click="removeCategory(c)">刪除</button>
          </li>
        </ul>

        <div class="modal__actions">
          <button class="btn--ghost btn" @click="categoryStore.reset()">重設預設分類</button>
          <button class="btn" @click="showCatModal = false">完成</button>
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
/* ---- Grid 表格：表頭與每列共用同一組欄位模板 ---- */
.ptable {
  margin-top: 1rem;
  background: var(--color-surface);
  border-radius: var(--radius);
  overflow: hidden;
}
.ptable__head,
.ptable__row {
  display: grid;
  grid-template-columns:
    minmax(0, 2.4fr) /* 商品 */
    minmax(0, 1fr) /* 價格 */
    minmax(0, 0.7fr) /* 庫存 */
    minmax(0, 1.8fr) /* 物流類別 */
    minmax(0, 0.6fr) /* 主打 */
    minmax(0, 1.4fr) /* 狀態 */
    minmax(0, 1fr); /* 操作 */
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
}
.ptable__head {
  font-weight: 600;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-line);
}
.ptable__row {
  border-bottom: 1px solid var(--color-line);
  cursor: pointer;
  transition: background 0.15s;
}
.ptable__row:last-child {
  border-bottom: none;
}
.ptable__row:hover {
  background: #eef2ea;
}
.ptable__row.inactive {
  opacity: 0.5;
}
.ta-c {
  text-align: center;
}
.cell-name {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}
.cell-name__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.cell-name__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cell-name__cat {
  font-size: 0.74rem;
  color: var(--color-accent);
  letter-spacing: 0.03em;
}
.cell-name img {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 8px;
}
.tag {
  font-size: 0.78rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  background: #eef1ea;
  color: var(--color-primary);
}
.tag[data-cls='BULKY'],
.tag[data-cls='FRAGILE'] {
  background: #fbe7e3;
  color: #b15a3c;
}
.cell-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.cell-switch.ta-c {
  justify-content: center;
}
.status {
  font-size: 0.85rem;
}
.status.on {
  color: var(--color-primary);
  font-weight: 600;
}
.status.off {
  color: var(--color-muted);
}

/* 上下架開關 */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  flex: 0 0 auto;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  inset: 0;
  background: #c9cdc4;
  border-radius: 22px;
  cursor: pointer;
  transition: background 0.2s;
}
.slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  left: 3px;
  top: 3px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
}
.switch input:checked + .slider {
  background: var(--color-primary);
}
.switch input:checked + .slider::before {
  transform: translateX(18px);
}
.cell-ops {
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
  max-width: 480px;
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
.modal__card input:not([type='checkbox']),
.modal__card textarea,
.modal__card select {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  margin-top: 0.25rem;
}
.row {
  display: flex;
  gap: 1rem;
}
.row label {
  flex: 1;
}
.switches {
  margin-top: 1rem;
}
.switch-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  font-size: 0.9rem;
}
/* 確保 modal 內的 switch 不被通用 label / .row label 樣式影響而被撐寬 */
.modal__card .switch {
  display: inline-block;
  flex: 0 0 40px; /* 覆蓋 .row label { flex:1 }，避免被拉長 */
  width: 40px;
  height: 22px;
  margin: 0;
}
.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1.4rem;
}

/* 分類管理 */
.hint {
  color: var(--color-muted);
  font-size: 0.85rem;
  margin: 0.3rem 0 1rem;
}
.cat-add {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1rem;
}
.cat-add input {
  flex: 1;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--color-line);
  border-radius: 8px;
}
.cat-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.cat-list li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.cat-name {
  flex: 1;
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-line);
  border-radius: 8px;
}

/* 手機：改為卡片式，每格自帶欄位標籤 */
@media (max-width: 640px) {
  .ptable__head {
    display: none;
  }
  .ptable__row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
    padding: 0.9rem;
  }
  .ptable__row > div[data-label]::before {
    content: attr(data-label) '：';
    color: var(--color-muted);
    margin-right: 0.3rem;
  }
  .ta-c {
    text-align: left;
  }
  .cell-name span {
    white-space: normal;
  }
  .cell-ops {
    margin-top: 0.4rem;
  }
}
</style>
