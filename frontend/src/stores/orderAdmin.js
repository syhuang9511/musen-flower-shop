import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

/**
 * 後台訂單管理 store（DEMO，LocalStorage）。
 *
 * 資料結構刻意「預留綠界金流 + 綠界物流」欄位，等後端接上後可直接對應：
 *  - payment.*   ← 綠界 ECPay 金流回拋（TradeNo、付款方式、付款時間…）
 *  - logistics.* ← 綠界 ECPay 物流回拋（託運單號、超商門市、物流狀態…）
 *
 * 待後端就緒後改為呼叫 orderApi（見 api/modules.js），畫面與欄位不需更動。
 */
const STORE_KEY = 'floral_admin_orders'

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

const SEED = [
  {
    id: 1,
    orderNo: 'FS17489001',
    createdAt: '2026-06-02T10:24:00',
    member: { name: '林宜蓁', email: 'yichen@example.com', phone: '0912-345-678' },
    status: 'SHIPPING',
    items: [
      { productName: '多肉植物小品盆栽', unitPrice: 380, qty: 2 },
      { productName: '陶瓷花盆 (中)', unitPrice: 290, qty: 1 },
    ],
    subtotal: 1050,
    discount: 100,
    shippingFee: 60,
    total: 1010,
    couponCode: 'WELCOME100',
    recipient: { name: '林宜蓁', phone: '0912-345-678', address: '' },
    shippingMethod: 'CVS_711',
    gift: null,
    payment: {
      status: 'PAID',
      method: '信用卡',
      ecpayTradeNo: '2306021024531234',
      merchantTradeNo: 'FS17489001',
      paidAt: '2026-06-02T10:26:12',
    },
    logistics: {
      status: 'IN_TRANSIT',
      subType: 'UNIMARTC2C',
      trackingNo: 'GM2306020001',
      ecpayLogisticsId: '6842531',
      cvsStore: { id: '131386', name: '7-11 沐森門市', address: '台北市大安區○○路 12 號' },
      shippedAt: '2026-06-02T15:00:00',
    },
  },
  {
    id: 2,
    orderNo: 'FS17489002',
    createdAt: '2026-06-03T14:08:00',
    member: { name: '陳冠廷', email: 'kevin@example.com', phone: '0922-111-222' },
    status: 'PREPARING',
    items: [{ productName: '當季鮮花花束 (大)', unitPrice: 1580, qty: 1 }],
    subtotal: 1580,
    discount: 0,
    shippingFee: 150,
    total: 1730,
    couponCode: null,
    recipient: { name: '陳冠廷', phone: '0922-111-222', address: '新北市板橋區○○街 5 號 3 樓' },
    shippingMethod: 'HOME_DELIVERY',
    gift: null,
    payment: {
      status: 'PAID',
      method: 'ATM 轉帳',
      ecpayTradeNo: '2306031408119876',
      merchantTradeNo: 'FS17489002',
      paidAt: '2026-06-03T14:35:40',
    },
    logistics: {
      status: 'PENDING',
      subType: 'HOME_TCAT',
      trackingNo: null,
      ecpayLogisticsId: null,
      cvsStore: null,
      shippedAt: null,
    },
  },
  {
    id: 3,
    orderNo: 'FS17489003',
    createdAt: '2026-06-03T19:45:00',
    member: { name: '王思敏', email: 'min@example.com', phone: '0933-444-555' },
    status: 'ACCEPTED',
    items: [
      { productName: '大型龜背芋落地盆栽', unitPrice: 2680, qty: 1 },
      { productName: '開幕祝賀大花籃', unitPrice: 3880, qty: 1 },
    ],
    subtotal: 6560,
    discount: 0,
    shippingFee: 0,
    total: 6560,
    couponCode: null,
    recipient: { name: '大安花坊（代收）', phone: '02-2700-0000', address: '台北市大安區○○路 100 號' },
    shippingMethod: 'TRUCK_DEDICATED',
    gift: {
      recipientName: '張總經理',
      recipientPhone: '02-2700-0000',
      companyName: '綠意設計有限公司',
      cardMessage: '開幕大吉，生意興隆！— 沐森植研所 敬賀',
      deliverySlot: '2026-06-06 上午',
    },
    payment: {
      status: 'PAID',
      method: '信用卡',
      ecpayTradeNo: '2306031945226543',
      merchantTradeNo: 'FS17489003',
      paidAt: '2026-06-03T19:47:55',
    },
    logistics: {
      status: 'PENDING',
      subType: null, // 專人貨車，不走第三方物流 API
      trackingNo: null,
      ecpayLogisticsId: null,
      cvsStore: null,
      shippedAt: null,
    },
  },
  {
    id: 4,
    orderNo: 'FS17489004',
    createdAt: '2026-06-04T09:12:00',
    member: { name: '游承恩', email: 'cheng@example.com', phone: '0955-666-777' },
    status: 'ACCEPTED',
    items: [{ productName: '有機營養土 5L', unitPrice: 220, qty: 3 }],
    subtotal: 660,
    discount: 0,
    shippingFee: 60,
    total: 720,
    couponCode: null,
    recipient: { name: '游承恩', phone: '0955-666-777', address: '' },
    shippingMethod: 'CVS_711',
    gift: null,
    payment: {
      status: 'UNPAID',
      method: '超商取貨付款',
      ecpayTradeNo: null,
      merchantTradeNo: 'FS17489004',
      paidAt: null,
    },
    logistics: {
      status: 'PENDING',
      subType: 'UNIMARTC2C',
      trackingNo: null,
      ecpayLogisticsId: null,
      cvsStore: { id: '991234', name: '7-11 板橋門市', address: '新北市板橋區○○路 88 號' },
      shippedAt: null,
    },
  },
  {
    id: 5,
    orderNo: 'FS17488990',
    createdAt: '2026-05-28T11:30:00',
    member: { name: '林宜蓁', email: 'yichen@example.com', phone: '0912-345-678' },
    status: 'COMPLETED',
    items: [{ productName: '陶瓷花盆 (中)', unitPrice: 290, qty: 2 }],
    subtotal: 580,
    discount: 0,
    shippingFee: 60,
    total: 640,
    couponCode: null,
    recipient: { name: '林宜蓁', phone: '0912-345-678', address: '' },
    shippingMethod: 'CVS_711',
    gift: null,
    payment: {
      status: 'PAID',
      method: '信用卡',
      ecpayTradeNo: '2305281130449988',
      merchantTradeNo: 'FS17488990',
      paidAt: '2026-05-28T11:32:01',
    },
    logistics: {
      status: 'PICKED_UP',
      subType: 'UNIMARTC2C',
      trackingNo: 'GM2305280007',
      ecpayLogisticsId: '6840012',
      cvsStore: { id: '131386', name: '7-11 沐森門市', address: '台北市大安區○○路 12 號' },
      shippedAt: '2026-05-28T16:00:00',
    },
  },
]

export const useOrderAdminStore = defineStore('orderAdmin', () => {
  const items = ref(load())

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
      if (Array.isArray(saved)) return saved
    } catch {
      /* ignore */
    }
    return SEED
  }

  watch(items, (val) => localStorage.setItem(STORE_KEY, JSON.stringify(val)), { deep: true })

  const list = computed(() =>
    [...items.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  )

  function find(id) {
    return items.value.find((o) => o.id === id)
  }

  /** 變更訂單主狀態 */
  function updateStatus(id, status) {
    const o = find(id)
    if (o) o.status = status
  }

  /** 標記已付款（實際應由綠界金流 callback 觸發） */
  function markPaid(id) {
    const o = find(id)
    if (!o) return
    o.payment.status = 'PAID'
    o.payment.paidAt = new Date().toISOString()
  }

  /**
   * 建立物流單（示範）。
   * 實際應呼叫後端 → 綠界物流 API 建單，取得託運單號與物流編號。
   * 專人貨車（TRUCK_DEDICATED）不走第三方物流，這裡擋掉。
   */
  function createLogistics(id) {
    const o = find(id)
    if (!o || o.shippingMethod === 'TRUCK_DEDICATED') return
    o.logistics.status = 'CREATED'
    o.logistics.trackingNo = 'GM' + Date.now().toString().slice(-10)
    o.logistics.ecpayLogisticsId = String(6800000 + o.id)
    if (o.status === 'ACCEPTED') o.status = 'PREPARING'
  }

  /** 標記出貨：物流進入運送中、訂單進入配送中 */
  function markShipped(id) {
    const o = find(id)
    if (!o) return
    o.logistics.status = 'IN_TRANSIT'
    o.logistics.shippedAt = new Date().toISOString()
    o.status = 'SHIPPING'
  }

  function cancel(id) {
    const o = find(id)
    if (o) o.status = 'CANCELLED'
  }

  /**
   * Demo 結帳：把購物車內容成立為一筆新訂單（後端就緒後改由後端 /orders 建立）。
   * 成立後會出現在訂單管理列表。回傳訂單編號。
   */
  function placeDemoOrder(data) {
    const nextId = items.value.reduce((m, o) => Math.max(m, o.id), 0) + 1
    const orderNo = 'FS' + String(Date.now()).slice(-8)
    const order = {
      id: nextId,
      orderNo,
      createdAt: new Date().toISOString(),
      member: {
        name: data.user?.name || data.recipient.name,
        email: data.user?.email || '',
        phone: data.recipient.phone,
      },
      status: 'ACCEPTED',
      items: data.lineItems.map((i) => ({ productName: i.name, unitPrice: i.price, qty: i.qty })),
      subtotal: data.subtotal,
      discount: data.discount || 0,
      shippingFee: data.shippingFee || 0,
      total: data.total,
      couponCode: data.couponCode || null,
      recipient: {
        name: data.recipient.name,
        phone: data.recipient.phone,
        address: data.recipient.address || '',
      },
      shippingMethod: data.shippingMethod,
      gift: data.gift || null,
      payment: { status: 'UNPAID', method: '綠界（測試）', ecpayTradeNo: null, merchantTradeNo: orderNo, paidAt: null },
      logistics: { status: 'PENDING', subType: null, trackingNo: null, ecpayLogisticsId: null, cvsStore: null, shippedAt: null },
    }
    items.value = [order, ...items.value]
    return order
  }

  function resetToSeed() {
    localStorage.removeItem(STORE_KEY)
    items.value = JSON.parse(JSON.stringify(SEED))
  }

  return {
    items,
    list,
    find,
    updateStatus,
    markPaid,
    createLogistics,
    markShipped,
    cancel,
    placeDemoOrder,
    resetToSeed,
  }
})
