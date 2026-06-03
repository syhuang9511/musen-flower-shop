import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

/**
 * 植栽養護 Q&A 知識庫 store。
 *
 * 與商品目錄相同策略：資料存於 LocalStorage，後台可新增/編輯/刪除，
 * 前台 QaView 直接讀取同一份資料 → 前後台連動。
 * 待後端就緒後，可改為呼叫 qaApi（見 api/modules.js）。
 */
const STORE_KEY = 'floral_qa'

export const QA_CATEGORIES = ['澆水與水分管理', '環境與光照', '施肥與養分管理', '大型植栽與祝賀花禮']

const SEED = [
  {
    category: '澆水與水分管理',
    image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=900&q=60',
    question: '請問這盆植物多久需要澆一次水？該怎麼澆？',
    answer:
      '澆水的頻率與方式會因為「植栽種類」而有很大的不同！例如：多肉與仙人掌極度耐旱，必須等土壤「完全乾燥」才能再次澆水；而多數觀葉植物則喜歡微濕潤，通常是「表土微乾就澆透」。\n\n通用小訣竅：將手指或木棒插入土壤約兩個指節深，感覺沒有濕潤感就可以澆水了。澆水時請緩慢均勻地澆灌，直到水從盆底流出，並務必將底盤的積水倒掉，保持根部透氣。',
  },
  {
    category: '環境與光照',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=60',
    question: '請問「明亮散射光」是什麼意思？冷氣房可以養植物嗎？',
    answer:
      '「明亮散射光」指的是植物能感受到充足的自然光，但不會被太陽直射烤傷的位置（例如：隔著透光薄窗簾的窗邊）。冷氣房絕對是可以養植栽的！但請務必避開冷氣出風口「直吹」的位置。若室內空氣較乾燥，對於喜歡濕潤的觀葉植物，可以在其周圍噴霧來局部增加空氣濕度。',
  },
  {
    category: '施肥與養分管理',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=60',
    question: '植物一定要施肥嗎？肥料該怎麼使用？',
    answer:
      '是的，施肥對植物的健康成長是絕對必要的！盆栽內的土壤養分有限，隨著植物生長與日常澆水，養分會逐漸流失，因此必須定期補充。\n\n使用方式：由於每種肥料的成分與濃度不同，請務必依照您所購買的肥料包裝上標示的「建議濃度」與「施肥週期」來進行。春夏成長季是植物最需要養分的時候；若使用液體肥料，請務必按比例稀釋，避免濃度過高造成肥傷。',
  },
  {
    category: '大型植栽與祝賀花禮',
    image: 'https://images.unsplash.com/photo-1567748157439-651aca2ff064?auto=format&fit=crop&w=900&q=60',
    question: '剛收到的開幕蘭花或大型落地盆栽，該怎麼照顧？',
    answer:
      '蘭花喜歡通風且明亮但不直曬的環境，澆水時請少量澆在根部的「水苔」上，避開花朵與葉心，約 7-10 天澆一次即可。至於大型落地盆栽，如果一開始就適應了室內明亮處，請「不要」頻繁推去室外曬太陽，突然移到室外強光下非常容易曬傷葉片。日常只要定期用濕布輕輕擦拭葉面灰塵，保持毛孔暢通即可。',
  },
]

export const useQaAdminStore = defineStore('qaAdmin', () => {
  const items = ref(load())

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
      if (Array.isArray(saved) && saved.length) return saved
    } catch {
      /* ignore */
    }
    return SEED.map((q, i) => ({ id: i + 1, ...q }))
  }

  watch(items, (val) => localStorage.setItem(STORE_KEY, JSON.stringify(val)), { deep: true })

  function nextId() {
    return items.value.reduce((max, q) => Math.max(max, q.id), 0) + 1
  }

  /** 關鍵字搜尋（問題、答案、分類） */
  function search(keyword) {
    const kw = (keyword || '').trim()
    if (!kw) return items.value
    return items.value.filter(
      (q) =>
        q.question.includes(kw) || q.answer.includes(kw) || q.category.includes(kw),
    )
  }

  function create(data) {
    items.value.push({ id: nextId(), ...data })
  }

  function update(id, data) {
    const idx = items.value.findIndex((q) => q.id === id)
    if (idx !== -1) items.value[idx] = { ...items.value[idx], ...data }
  }

  function remove(id) {
    items.value = items.value.filter((q) => q.id !== id)
  }

  function resetToSeed() {
    localStorage.removeItem(STORE_KEY)
    items.value = SEED.map((q, i) => ({ id: i + 1, ...q }))
  }

  const categories = computed(() => [...new Set(items.value.map((q) => q.category))])

  return { items, categories, search, create, update, remove, resetToSeed }
})
