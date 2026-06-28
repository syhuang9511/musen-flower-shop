import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

/**
 * 商品頁活動輪播橫幅（DEMO，LocalStorage）。
 * 後台可新增/編輯/刪除/排序，最多 10 張；前台商品頁讀取 active 的橫幅輪播。
 */
const STORE_KEY = 'floral_banners'
export const MAX_BANNERS = 10

const SEED = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1600&q=70',
    title: '母親節限定花禮',
    subtitle: '康乃馨 × 當季鮮花，即日起滿 NT$1,000 折 100（WELCOME100）',
    link: '/events',
    active: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1600&q=70',
    title: '觀葉植栽特展',
    subtitle: '把森林帶回家，精選大型落地植栽・雙北專人配送',
    link: '/events',
    active: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=70',
    title: '新會員首購禮',
    subtitle: '註冊即享折價券，植感生活從這裡開始',
    link: '/register',
    active: true,
  },
]

export const useBannerAdminStore = defineStore('bannerAdmin', () => {
  const items = ref(load())

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
      if (Array.isArray(saved)) return saved
    } catch {
      /* ignore */
    }
    return SEED
  }

  watch(items, (val) => localStorage.setItem(STORE_KEY, JSON.stringify(val)), { deep: true })

  const activeBanners = computed(() => items.value.filter((b) => b.active))
  const canAdd = computed(() => items.value.length < MAX_BANNERS)

  function nextId() {
    return items.value.reduce((max, b) => Math.max(max, b.id), 0) + 1
  }

  function create(data) {
    if (items.value.length >= MAX_BANNERS) return
    items.value.push({ id: nextId(), active: true, ...data })
  }

  function update(id, data) {
    const idx = items.value.findIndex((b) => b.id === id)
    if (idx !== -1) items.value[idx] = { ...items.value[idx], ...data }
  }

  function remove(id) {
    items.value = items.value.filter((b) => b.id !== id)
  }

  /** 調整順序：dir = -1 上移 / +1 下移 */
  function move(id, dir) {
    const idx = items.value.findIndex((b) => b.id === id)
    const target = idx + dir
    if (idx === -1 || target < 0 || target >= items.value.length) return
    const arr = [...items.value]
    ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
    items.value = arr
  }

  function resetToSeed() {
    localStorage.removeItem(STORE_KEY)
    items.value = JSON.parse(JSON.stringify(SEED))
  }

  return { items, activeBanners, canAdd, create, update, remove, move, resetToSeed }
})
