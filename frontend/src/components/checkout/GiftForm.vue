<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({ modelValue: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue'])

const gift = reactive(
  props.modelValue || {
    recipientName: '',
    recipientPhone: '',
    companyName: '',
    cardMessage: '',
    deliverySlot: '',
  },
)

const messageTemplates = [
  '生意興隆 鴻圖大展',
  '喬遷誌喜 鴻運當頭',
  '祝您生日快樂 幸福美滿',
  '永浴愛河 百年好合',
]

const deliverySlots = [
  { value: 'AM_09_12', label: '上午 09:00 - 12:00' },
  { value: 'PM_14_17', label: '下午 14:00 - 17:00' },
]

watch(gift, () => emit('update:modelValue', { ...gift }), { deep: true, immediate: true })
</script>

<template>
  <div class="gift-form">
    <input v-model="gift.recipientName" placeholder="收禮人姓名" />
    <input v-model="gift.recipientPhone" placeholder="收禮人聯絡電話" />
    <input v-model="gift.companyName" placeholder="店家 / 單位名稱（商務祝賀花籃）" />

    <label>卡片祝賀詞</label>
    <div class="templates">
      <button
        v-for="t in messageTemplates"
        :key="t"
        type="button"
        class="chip"
        @click="gift.cardMessage = t"
      >
        {{ t }}
      </button>
    </div>
    <textarea v-model="gift.cardMessage" rows="3" placeholder="輸入或選擇祝賀詞"></textarea>

    <label>期望送達時間區間</label>
    <select v-model="gift.deliverySlot">
      <option value="" disabled>請選擇</option>
      <option v-for="s in deliverySlots" :key="s.value" :value="s.value">{{ s.label }}</option>
    </select>
  </div>
</template>

<style scoped>
.gift-form {
  padding-top: 0.8rem;
}
.gift-form input,
.gift-form textarea,
.gift-form select {
  display: block;
  width: 100%;
  padding: 0.6rem;
  margin: 0.4rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.templates {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.4rem 0;
}
.chip {
  border: 1px solid var(--color-primary);
  background: #fff;
  color: var(--color-primary);
  border-radius: 16px;
  padding: 0.25rem 0.8rem;
  font-size: 0.85rem;
}
</style>
