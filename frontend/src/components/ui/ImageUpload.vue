<script setup>
import { ref } from 'vue'

/**
 * 圖片檔案上傳（可離線 demo）：
 * 讀取使用者選的圖片 → 以 canvas 縮圖（最長邊 900px）→ 轉成 base64 Data URL，
 * 透過 v-model 回傳。資料直接存進商品 / Q&A（LocalStorage），無需後端。
 *
 * 接後端時：把 emit(dataURL) 改為「POST 檔案到 /admin/uploads，回傳圖片網址」即可。
 */
const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const error = ref('')
const busy = ref(false)

function pick() {
  fileInput.value?.click()
}

function onFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    error.value = '請選擇圖片檔案'
    return
  }
  error.value = ''
  busy.value = true

  const img = new Image()
  const url = URL.createObjectURL(file)
  img.onload = () => {
    const max = 900
    let { width, height } = img
    if (width > max || height > max) {
      const scale = max / Math.max(width, height)
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(img, 0, 0, width, height)
    URL.revokeObjectURL(url)
    emit('update:modelValue', canvas.toDataURL('image/jpeg', 0.82))
    busy.value = false
  }
  img.onerror = () => {
    error.value = '圖片讀取失敗，請換一張'
    URL.revokeObjectURL(url)
    busy.value = false
  }
  img.src = url
  e.target.value = '' // 允許再次選同一檔案
}

function clear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="uploader">
    <div class="uploader__preview" :class="{ empty: !modelValue }" @click="pick">
      <img v-if="modelValue" :src="modelValue" alt="預覽" />
      <span v-else>{{ busy ? '處理中…' : '＋ 點此上傳圖片' }}</span>
    </div>
    <div class="uploader__actions">
      <button type="button" class="btn--ghost btn" @click="pick">
        {{ modelValue ? '更換圖片' : '選擇檔案' }}
      </button>
      <button v-if="modelValue" type="button" class="link danger" @click="clear">移除</button>
    </div>
    <input ref="fileInput" type="file" accept="image/*" hidden @change="onFile" />
    <p v-if="error" class="err">{{ error }}</p>
  </div>
</template>

<style scoped>
.uploader__preview {
  width: 100%;
  aspect-ratio: 16 / 10;
  border: 1.5px dashed var(--color-line);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  background: #f7f6f1;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s;
}
.uploader__preview:hover {
  border-color: var(--color-primary);
}
.uploader__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploader__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.6rem;
}
.link.danger {
  background: none;
  border: none;
  color: #c0392b;
}
.err {
  color: #c0392b;
  font-size: 0.85rem;
  margin: 0.4rem 0 0;
}
</style>
