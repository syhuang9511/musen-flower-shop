import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { adminQaApi } from '@/api/modules'

export const QA_CATEGORIES = ['澆水與水分管理', '環境與光照', '施肥與養分管理', '大型植栽與祝賀花禮']

export const useQaAdminStore = defineStore('qaAdmin', () => {
  const items = ref([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const res = await adminQaApi.list()
      items.value = res.data ?? res
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const res = await adminQaApi.create(data)
    items.value.push(res.data ?? res)
  }

  async function update(id, data) {
    const res = await adminQaApi.update(id, data)
    const updated = res.data ?? res
    const idx = items.value.findIndex((q) => q.id === id)
    if (idx !== -1) items.value[idx] = updated
  }

  async function remove(id) {
    await adminQaApi.remove(id)
    items.value = items.value.filter((q) => q.id !== id)
  }

  function search(keyword) {
    const kw = (keyword || '').trim()
    if (!kw) return items.value
    return items.value.filter(
      (q) => q.question.includes(kw) || q.answer.includes(kw) || q.category.includes(kw),
    )
  }

  const categories = computed(() => [...new Set(items.value.map((q) => q.category))])

  return { items, loading, categories, fetchAll, create, update, remove, search }
})
