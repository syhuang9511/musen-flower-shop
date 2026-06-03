import { defineStore } from 'pinia'
import { ref } from 'vue'

/** 全域輕量提示（toast） */
export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let seq = 0

  function show(message, type = 'success', duration = 1800) {
    const id = ++seq
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), duration)
  }

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, show, dismiss }
})
