import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useToastStore } from './toast'

/**
 * 物流類別（與後端 LogisticsClass enum 對應）
 * - GENERAL : 一般資材（營養土、肥料、花盆、小工具）→ 可超商 / 宅配
 * - BULKY   : 大型盆栽 / 祝賀大花籃            → 強制專人貨車
 * - FRAGILE : 高脆弱鮮花                       → 強制專人貨車
 */
export const LogisticsClass = Object.freeze({
  GENERAL: 'GENERAL',
  BULKY: 'BULKY',
  FRAGILE: 'FRAGILE',
})

export const ShippingMethod = Object.freeze({
  CVS_711: 'CVS_711', // 7-11 店到店
  HOME_DELIVERY: 'HOME_DELIVERY', // 一般宅配
  TRUCK_DEDICATED: 'TRUCK_DEDICATED', // 專人貨車外送
})

/**
 * 依商品物流類別回傳「配送方式說明」，供商品頁顯示。
 * - 一般資材：可超商取貨或宅配
 * - 大型 / 脆弱：僅限專人貨車外送（無法超商，也無法一般宅配）
 */
export function shippingInfoFor(logisticsClass) {
  const truckOnly =
    logisticsClass === LogisticsClass.BULKY || logisticsClass === LogisticsClass.FRAGILE
  if (truckOnly) {
    return {
      truckOnly: true,
      methods: ['專人貨車外送'],
      note: '本商品體積較大或屬易碎鮮花，為確保品質，僅提供「專人貨車外送」，無法超商取貨或一般宅配。',
    }
  }
  return {
    truckOnly: false,
    methods: ['7-11 店到店超商取貨', '一般宅配'],
    note: '本商品可自由選擇「7-11 店到店超商取貨」或「一般宅配」。',
  }
}

const CART_KEY = 'floral_cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadFromStorage())

  function loadFromStorage() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    } catch {
      return []
    }
  }

  watch(items, (val) => localStorage.setItem(CART_KEY, JSON.stringify(val)), { deep: true })

  // ---- 基本操作 ----
  function addItem(product, qty = 1) {
    const existing = items.value.find((i) => i.productId === product.id)
    if (existing) {
      existing.qty += qty
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        logisticsClass: product.logisticsClass,
        qty,
      })
    }
    useToastStore().show('已加入購物車')
  }

  function removeItem(productId) {
    items.value = items.value.filter((i) => i.productId !== productId)
  }

  /** 設定指定商品數量（最小為 1） */
  function updateQty(productId, qty) {
    const item = items.value.find((i) => i.productId === productId)
    if (item) item.qty = Math.max(1, Math.floor(qty) || 1)
  }

  function clear() {
    items.value = []
  }

  // ---- 金額 ----
  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.qty, 0),
  )

  // ---- 核心：最高物流限制原則 ----
  // 只要購物車含任一 BULKY / FRAGILE 商品，全車強制專人貨車，停用超商取貨。
  const requiresDedicatedTruck = computed(() =>
    items.value.some(
      (i) => i.logisticsClass === LogisticsClass.BULKY || i.logisticsClass === LogisticsClass.FRAGILE,
    ),
  )

  /** 結帳頁可選的配送方式（被鎖定時只剩專人貨車） */
  const availableShippingMethods = computed(() => {
    if (requiresDedicatedTruck.value) {
      return [ShippingMethod.TRUCK_DEDICATED]
    }
    return [ShippingMethod.CVS_711, ShippingMethod.HOME_DELIVERY]
  })

  /** 觸發鎖定時，前端介面顯示的溫馨提示 */
  const logisticsNotice = computed(() =>
    requiresDedicatedTruck.value
      ? '由於您購物車中包含大型或脆弱植栽，為了確保商品品質，本次訂單將統一由專業貨車為您專人配送。'
      : '',
  )

  return {
    items,
    addItem,
    removeItem,
    updateQty,
    clear,
    subtotal,
    requiresDedicatedTruck,
    availableShippingMethods,
    logisticsNotice,
  }
})
