import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

/**
 * 商品分類管理（可由後台新增/改名/刪除）。
 * 存於 LocalStorage，前台分類頁籤與後台商品表單共用同一份清單。
 */
const STORE_KEY = 'floral_product_categories'

export const DEFAULT_CATEGORIES = ['多肉植物', '觀葉植物', '鮮花花束', '盆器資材', '祝賀花禮']

export const useCategoryStore = defineStore('category', () => {
  const categories = ref(load())

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
      if (Array.isArray(saved) && saved.length) return saved
    } catch {
      /* ignore */
    }
    return [...DEFAULT_CATEGORIES]
  }

  watch(categories, (val) => localStorage.setItem(STORE_KEY, JSON.stringify(val)), { deep: true })

  function add(name) {
    const n = (name || '').trim()
    if (n && !categories.value.includes(n)) {
      categories.value.push(n)
      return true
    }
    return false
  }

  function rename(oldName, newName) {
    const n = (newName || '').trim()
    const idx = categories.value.indexOf(oldName)
    if (idx !== -1 && n && !categories.value.includes(n)) {
      categories.value[idx] = n
    }
  }

  function remove(name) {
    categories.value = categories.value.filter((c) => c !== name)
  }

  function reset() {
    localStorage.removeItem(STORE_KEY)
    categories.value = [...DEFAULT_CATEGORIES]
  }

  return { categories, add, rename, remove, reset }
})
