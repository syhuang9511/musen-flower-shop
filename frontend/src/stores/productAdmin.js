import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { LogisticsClass } from './cart'

/**
 * 商品目錄 store。
 *
 * 為了在「後端尚未啟動」時也能完整 demo 上架流程，本 store 將商品存於
 * LocalStorage，並提供與後端 AdminProductController 對應的 CRUD 操作。
 * 待後端就緒後，可把這些方法改為呼叫 adminProductApi（見 api/modules.js）。
 *
 * 前台（HomeView / ProductListView）在 API 取不到資料時，也會 fallback 讀取
 * 這份目錄，因此「後台上架 → 前台立即看到」可端到端串起來。
 */
const STORE_KEY = 'floral_catalog'

/** 商品分類（前台分類頁籤、後台上架選單共用） */
export const CATEGORIES = ['多肉植物', '觀葉植物', '鮮花花束', '盆器資材', '祝賀花禮']

const SEED = [
  {
    name: '多肉植物小品盆栽', category: '多肉植物',
    description:
      '小巧療癒的桌上多肉，葉片飽滿圓潤、自帶霧面質感。極耐旱好照顧，約每 7–10 天待介質乾透再澆水即可，明亮散射光下生長最佳。適合擺放於辦公桌、窗邊或書架，為日常增添一抹綠意。隨盆附素燒小盆與底盤。',
    price: 380, image: 'https://picsum.photos/seed/succulent/600', stock: 50, logisticsClass: LogisticsClass.GENERAL, featured: true, active: true,
  },
  {
    name: '有機營養土 5L', category: '盆器資材',
    description:
      '嚴選椰纖、泥炭土與珍珠石調配的通用型介質，疏鬆透氣、保水卻不積水，能有效降低爛根風險。pH 值溫和、未添加化學肥料，適合多數觀葉植物與多肉換盆使用，新手也能輕鬆上手。容量 5 公升。',
    price: 220, image: 'https://picsum.photos/seed/soil/600', stock: 100, logisticsClass: LogisticsClass.GENERAL, featured: false, active: true,
  },
  {
    name: '陶瓷花盆（中）', category: '盆器資材',
    description:
      '簡約無印風格的陶瓷盆器，霧面釉色耐看百搭。盆底附排水孔與專屬底盤，兼顧美感與植物健康。盆口直徑約 15cm，適合中型觀葉植物，或多株多肉組盆種植。',
    price: 290, image: 'https://picsum.photos/seed/pot/600', stock: 80, logisticsClass: LogisticsClass.GENERAL, featured: false, active: true,
  },
  {
    name: '大型龜背芋落地盆栽', category: '觀葉植物',
    description:
      '高度約 120cm 的室內綠化首選，葉片碩大、裂葉造型俐落，是空間的視覺焦點。耐陰好照顧，置於明亮散射光處生長最佳，土乾再澆水即可。因株型高大、葉片易折，配送時由專人貨車運送並協助擺位。',
    price: 2680, image: 'https://picsum.photos/seed/monstera/600', stock: 12, logisticsClass: LogisticsClass.BULKY, featured: true, active: true,
  },
  {
    name: '開幕祝賀大花籃', category: '祝賀花禮',
    description:
      '商務祝賀首選的大型花籃，選用當季鮮花搭配蘭花，氣派隆重、體面大方。內含賀詞卡片代寫服務，並可指定送達時間區間。因花籃體積龐大且鮮花脆弱，一律由專人貨車配送並現場擺放，確保到場完美呈現。',
    price: 3880, image: 'https://picsum.photos/seed/basket/600', stock: 8, logisticsClass: LogisticsClass.BULKY, featured: true, active: true,
  },
  {
    name: '當季鮮花花束（大）', category: '鮮花花束',
    description:
      '每日清晨進貨的當季鮮花，由花藝師手工綁製，層次豐富、色系雅緻，適合生日、紀念日與探訪致意。附保水包裝與照護小卡。鮮花嬌嫩易損，僅提供專人貨車配送，避免運送途中碰撞影響品質。',
    price: 1580, image: 'https://picsum.photos/seed/bouquet/600', stock: 20, logisticsClass: LogisticsClass.FRAGILE, featured: true, active: true,
  },
  {
    name: '虎尾蘭淨化盆栽', category: '觀葉植物',
    description:
      '葉片挺拔俐落的虎尾蘭，是公認最好養的觀葉植物之一，耐陰耐旱、半個月澆一次水也無妨，並具有夜間釋氧的特性，很適合擺在臥室或辦公室。附簡約素盆。',
    price: 520, image: 'https://picsum.photos/seed/snakeplant/600', stock: 40, logisticsClass: LogisticsClass.GENERAL, featured: true, active: true,
  },
  {
    name: '沙漠仙人掌小盆', category: '多肉植物',
    description:
      '造型獨特的迷你仙人掌，極度耐旱、近乎免照顧，只需充足光照與偶爾的水分。小巧不佔空間，單擺或組合都很有個性，是入門植栽的好選擇。',
    price: 320, image: 'https://picsum.photos/seed/cactus/600', stock: 60, logisticsClass: LogisticsClass.GENERAL, featured: true, active: true,
  },
  {
    name: '康乃馨感恩花束', category: '鮮花花束',
    description:
      '以溫柔色系康乃馨為主的感恩花束，象徵感謝與祝福，最適合母親節與各式致謝場合。花藝師手綁、附賀卡。鮮花易損，僅提供專人貨車配送。',
    price: 1280, image: 'https://picsum.photos/seed/carnation/600', stock: 25, logisticsClass: LogisticsClass.FRAGILE, featured: true, active: true,
  },
  {
    name: '質感玻璃花器', category: '盆器資材',
    description:
      '簡約透明的手工玻璃花器，無論插上鮮花、水耕綠植或單純擺放都很耐看。瓶身厚實穩重，瓶口寬度適中，是佈置桌面與窗台的百搭單品。',
    price: 460, image: 'https://picsum.photos/seed/vase/600', stock: 35, logisticsClass: LogisticsClass.GENERAL, featured: false, active: true,
  },
]

export const useProductAdminStore = defineStore('productAdmin', () => {
  const products = ref(load())

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
      if (Array.isArray(saved) && saved.length) return saved
    } catch {
      /* ignore */
    }
    // 首次使用：灌入種子資料並補上 id
    return SEED.map((p, i) => ({ id: i + 1, ...p }))
  }

  watch(products, (val) => localStorage.setItem(STORE_KEY, JSON.stringify(val)), { deep: true })

  const activeProducts = computed(() => products.value.filter((p) => p.active))
  const featuredProducts = computed(() => activeProducts.value.filter((p) => p.featured))

  function nextId() {
    return products.value.reduce((max, p) => Math.max(max, p.id), 0) + 1
  }

  function findById(id) {
    return products.value.find((p) => p.id === Number(id)) || null
  }

  function create(data) {
    products.value.push({ id: nextId(), ...data })
  }

  function update(id, data) {
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx !== -1) products.value[idx] = { ...products.value[idx], ...data }
  }

  function toggleActive(id) {
    const p = findById(id)
    if (p) p.active = !p.active
  }

  function toggleFeatured(id) {
    const p = findById(id)
    if (p) p.featured = !p.featured
  }

  function remove(id) {
    products.value = products.value.filter((p) => p.id !== id)
  }

  function resetToSeed() {
    localStorage.removeItem(STORE_KEY)
    products.value = SEED.map((p, i) => ({ id: i + 1, ...p }))
  }

  return {
    products,
    activeProducts,
    featuredProducts,
    findById,
    create,
    update,
    toggleActive,
    toggleFeatured,
    remove,
    resetToSeed,
  }
})
