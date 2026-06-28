import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminProductApi } from '@/api/modules'

/** 商品分類選項（前後台共用靜態清單） */
export const CATEGORIES = ['多肉植物', '觀葉植物', '鮮花花束', '盆器資材', '祝賀花禮']

export const useProductAdminStore = defineStore('productAdmin', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const res = await adminProductApi.list()
      products.value = res.data ?? res
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const res = await adminProductApi.create(data)
    products.value.push(res.data ?? res)
  }

  async function update(id, data) {
    const res = await adminProductApi.update(id, data)
    const updated = res.data ?? res
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx !== -1) products.value[idx] = updated
  }

  async function toggleActive(id, active) {
    const res = await adminProductApi.toggleActive(id, active)
    const updated = res.data ?? res
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx !== -1) products.value[idx] = updated
  }

  async function toggleFeatured(id, featured) {
    const res = await adminProductApi.toggleFeatured(id, featured)
    const updated = res.data ?? res
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx !== -1) products.value[idx] = updated
  }

  async function remove(id) {
    await adminProductApi.remove(id)
    products.value = products.value.filter((p) => p.id !== id)
  }

  function findById(id) {
    return products.value.find((p) => p.id === Number(id)) || null
  }

  return { products, loading, error, fetchAll, create, update, toggleActive, toggleFeatured, remove, findById }
})
