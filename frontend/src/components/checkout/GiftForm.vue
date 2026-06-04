<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({ modelValue: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue'])

const gift = reactive(
  props.modelValue || {
    recipientName: '',
    recipientPhone: '',
    companyName: '',
    cardMessage: '',
    deliveryDate: '',
    deliverySlot: '',
  },
)

// 祝賀詞分類模板
const messageGroups = [
  {
    label: '商務祝賀',
    items: ['生意興隆 鴻圖大展', '開業大吉 財源廣進', '喬遷誌喜 鴻運當頭'],
  },
  {
    label: '生日祝福',
    items: ['祝你生日快樂 幸福美滿', '又長大一歲，願你被世界溫柔以待'],
  },
  {
    label: '戀人・情侶',
    items: [
      '親愛的，遇見你是我最美的風景 💕',
      '謝謝你一直在我身邊，我愛你',
      '願我們的愛，像這束花一樣盛放',
      '紀念日快樂，下一個十年也要牽著你的手',
    ],
  },
  {
    label: '婚禮祝賀',
    items: ['永浴愛河 百年好合', '新婚誌喜 鶼鰈情深'],
  },
]

// 希望送達時段（更細緻）
const deliverySlots = ['上午 09:00–12:00', '中午 12:00–14:00', '下午 14:00–17:00', '傍晚 17:00–19:00']

const todayStr = computed(() => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
})

watch(gift, () => emit('update:modelValue', { ...gift }), { deep: true, immediate: true })
</script>

<template>
  <div class="gift-form">
    <input v-model="gift.recipientName" placeholder="收禮人姓名" />
    <input v-model="gift.recipientPhone" placeholder="收禮人聯絡電話" />
    <input v-model="gift.companyName" placeholder="店家 / 單位名稱（商務祝賀花籃）" />

    <label>卡片祝賀詞</label>
    <div v-for="g in messageGroups" :key="g.label" class="tpl-group">
      <span class="tpl-group__label">{{ g.label }}</span>
      <div class="templates">
        <button
          v-for="t in g.items"
          :key="t"
          type="button"
          class="chip"
          @click="gift.cardMessage = t"
        >
          {{ t }}
        </button>
      </div>
    </div>
    <textarea v-model="gift.cardMessage" rows="3" placeholder="輸入或點選上方祝賀詞"></textarea>

    <label>希望送達時間</label>
    <div class="when-row">
      <input type="date" v-model="gift.deliveryDate" :min="todayStr" />
      <select v-model="gift.deliverySlot">
        <option value="" disabled>選擇時段</option>
        <option v-for="s in deliverySlots" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>
    <p class="when-hint">※ 為希望時段，實際送達時間將於確認訂單時與您聯繫；專人配送以雙方確認檔期為準。</p>
  </div>
</template>

<style scoped>
.gift-form {
  padding-top: 0.8rem;
}
.gift-form > input,
.gift-form textarea {
  display: block;
  width: 100%;
  padding: 0.6rem;
  margin: 0.4rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.gift-form > label {
  display: block;
  margin: 0.8rem 0 0.2rem;
  font-weight: 600;
  font-size: 0.9rem;
}
.tpl-group {
  margin: 0.5rem 0;
}
.tpl-group__label {
  display: block;
  font-size: 0.78rem;
  color: var(--color-accent);
  letter-spacing: 0.04em;
  margin-bottom: 0.3rem;
}
.templates {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.chip {
  border: 1px solid var(--color-primary);
  background: #fff;
  color: var(--color-primary);
  border-radius: 16px;
  padding: 0.25rem 0.8rem;
  font-size: 0.85rem;
}
.chip:hover {
  background: var(--color-primary);
  color: #fff;
}
.when-row {
  display: flex;
  gap: 0.6rem;
  margin: 0.4rem 0;
}
.when-row input,
.when-row select {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font: inherit;
  background: #fff;
}
.when-hint {
  font-size: 0.8rem;
  color: var(--color-muted);
  margin: 0.3rem 0 0;
  line-height: 1.6;
}

@media (max-width: 480px) {
  .when-row {
    flex-direction: column;
  }
}
</style>
