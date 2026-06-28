import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { adminOrderApi } from '@/api/modules'

/** 訂單主狀態 */
export const ORDER_STATUS = {
  ACCEPTED: '已接單',
  PREPARING: '備貨中',
  SHIPPING: '配送中',
  DELIVERED: '已送達',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
}

/** 金流（綠界）付款狀態 */
export const PAYMENT_STATUS = {
  UNPAID: '未付款',
  PAID: '已付款',
  FAILED: '付款失敗',
  REFUNDED: '已退款',
}

/** 物流（綠界）狀態 */
export const LOGISTICS_STATUS = {
  PENDING: '待出貨',
  CREATED: '已建立物流單',
  IN_TRANSIT: '運送中',
  ARRIVED: '已到店',
  PICKED_UP: '已取件',
  DELIVERED: '已送達',
  RETURNED: '退貨',
}

/** 配送方式 */
export const SHIPPING_METHOD = {
  CVS_711: '7-11 超商取貨',
  HOME_DELIVERY: '宅配到府',
  TRUCK_DEDICATED: '專人貨車外送',
}

export const useOrderAdminStore = defineStore('orderAdmin', () => {
  const items = ref([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const res = await adminOrderApi.list()
      items.value = res.data ?? res
    } finally {
      loading.value = false
    }
  }

  const list = computed(() =>
    [...items.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  )

  function find(id) {
    return items.value.find((o) => o.id === id)
  }

  async function updateStatus(id, status) {
    try {
      const res = await adminOrderApi.updateStatus(id, status)
      const updated = res.data ?? res
      const idx = items.value.findIndex((o) => o.id === id)
      if (idx !== -1) items.value[idx] = updated
    } catch {
      // 更新本地狀態作為後備
      const o = find(id)
      if (o) o.status = status
    }
  }

  async function cancel(id) {
    return updateStatus(id, 'CANCELLED')
  }

  // 以下為 ECPay 整合後才會有真實資料，目前僅更新本地狀態
  function markPaid(id) {
    const o = find(id)
    if (!o) return
    if (!o.payment) o.payment = {}
    o.payment.status = 'PAID'
    o.payment.paidAt = new Date().toISOString()
  }

  function createLogistics(id) {
    const o = find(id)
    if (!o || o.shippingMethod === 'TRUCK_DEDICATED') return
    if (!o.logistics) o.logistics = {}
    o.logistics.status = 'CREATED'
    o.logistics.trackingNo = 'GM' + Date.now().toString().slice(-10)
    if (o.status === 'ACCEPTED') updateStatus(id, 'PREPARING')
  }

  function markShipped(id) {
    const o = find(id)
    if (!o) return
    if (!o.logistics) o.logistics = {}
    o.logistics.status = 'IN_TRANSIT'
    o.logistics.shippedAt = new Date().toISOString()
    updateStatus(id, 'SHIPPING')
  }

  async function resetToSeed() {
    return fetchAll()
  }

  // 結帳後由 CheckoutView 呼叫，實際已由後端建立訂單，此處刷新列表
  async function placeDemoOrder() {
    return fetchAll()
  }

  return {
    items, loading, list, find,
    fetchAll, updateStatus, cancel, markPaid, createLogistics, markShipped,
    resetToSeed, placeDemoOrder,
  }
})
