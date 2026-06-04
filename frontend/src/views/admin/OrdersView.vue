<script setup>
import { computed, ref } from 'vue'
import {
  useOrderAdminStore,
  ORDER_STATUS,
  PAYMENT_STATUS,
  LOGISTICS_STATUS,
  SHIPPING_METHOD,
} from '@/stores/orderAdmin'
import {
  exportOrdersCsv,
  exportOrdersXlsx,
  printOrders,
  printSingleOrder,
} from '@/utils/exportOrders'

const store = useOrderAdminStore()

const keyword = ref('')
const statusFilter = ref('ALL')
const selectedId = ref(null)
const exportingXlsx = ref(false)

async function onExportXlsx() {
  if (!filtered.value.length) return
  exportingXlsx.value = true
  try {
    await exportOrdersXlsx(filtered.value)
  } finally {
    exportingXlsx.value = false
  }
}

const selected = computed(() => (selectedId.value ? store.find(selectedId.value) : null))

const filtered = computed(() => {
  const kw = keyword.value.trim()
  return store.list.filter((o) => {
    if (statusFilter.value !== 'ALL' && o.status !== statusFilter.value) return false
    if (!kw) return true
    return o.orderNo.includes(kw) || o.member.name.includes(kw) || o.member.email.includes(kw)
  })
})

const orderStatusClass = {
  ACCEPTED: 'st-blue',
  PREPARING: 'st-amber',
  SHIPPING: 'st-violet',
  DELIVERED: 'st-green',
  COMPLETED: 'st-green',
  CANCELLED: 'st-grey',
}
const payClass = { PAID: 'st-green', UNPAID: 'st-amber', FAILED: 'st-red', REFUNDED: 'st-grey' }
const logiClass = {
  PENDING: 'st-amber',
  CREATED: 'st-blue',
  IN_TRANSIT: 'st-violet',
  ARRIVED: 'st-violet',
  PICKED_UP: 'st-green',
  DELIVERED: 'st-green',
  RETURNED: 'st-red',
}

function fmt(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(
    d.getDate(),
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function open(o) {
  selectedId.value = o.id
}
function close() {
  selectedId.value = null
}
</script>

<template>
  <div class="orders">
    <div class="head">
      <h1>訂單管理</h1>
      <button class="btn--ghost btn" @click="store.resetToSeed()">重設示範訂單</button>
    </div>
    <p class="hint">
      此頁已預留<strong>綠界金流</strong>與<strong>綠界物流</strong>欄位；待後端串接後，付款與物流狀態將由綠界回拋自動更新。
    </p>

    <!-- 篩選 -->
    <div class="toolbar">
      <input v-model="keyword" class="search" placeholder="搜尋訂單編號 / 會員姓名 / Email" />
      <select v-model="statusFilter" class="sel">
        <option value="ALL">全部狀態</option>
        <option v-for="(label, key) in ORDER_STATUS" :key="key" :value="key">{{ label }}</option>
      </select>
      <div class="exports">
        <span class="exports__label">匯出（{{ filtered.length }} 筆）</span>
        <button class="exp" :disabled="!filtered.length || exportingXlsx" @click="onExportXlsx">
          {{ exportingXlsx ? '產生中…' : 'Excel' }}
        </button>
        <button class="exp" :disabled="!filtered.length" @click="exportOrdersCsv(filtered)">CSV</button>
        <button class="exp" :disabled="!filtered.length" @click="printOrders(filtered, '訂單清單')">PDF / 列印</button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="otable">
      <div class="otable__head">
        <div>訂單編號</div>
        <div>會員</div>
        <div class="ta-r">金額</div>
        <div>付款</div>
        <div>物流</div>
        <div>訂單狀態</div>
        <div>下單時間</div>
      </div>

      <p v-if="!filtered.length" class="empty">沒有符合條件的訂單。</p>

      <div
        v-for="o in filtered"
        :key="o.id"
        class="otable__row"
        @click="open(o)"
      >
        <div data-label="訂單編號"><strong>{{ o.orderNo }}</strong></div>
        <div data-label="會員">
          {{ o.member.name }}<small>{{ o.member.email }}</small>
        </div>
        <div data-label="金額" class="ta-r">NT$ {{ o.total.toLocaleString() }}</div>
        <div data-label="付款">
          <span class="tag" :class="payClass[o.payment.status]">{{ PAYMENT_STATUS[o.payment.status] }}</span>
        </div>
        <div data-label="物流">
          <span class="tag" :class="logiClass[o.logistics.status]">{{ LOGISTICS_STATUS[o.logistics.status] }}</span>
        </div>
        <div data-label="訂單狀態">
          <span class="tag" :class="orderStatusClass[o.status]">{{ ORDER_STATUS[o.status] }}</span>
        </div>
        <div data-label="下單時間" class="muted">{{ fmt(o.createdAt) }}</div>
      </div>
    </div>

    <!-- 詳情 -->
    <div v-if="selected" class="modal" @click.self="close">
      <div class="modal__card">
        <header class="modal__head">
          <div>
            <h2>{{ selected.orderNo }}</h2>
            <small class="muted">下單時間 {{ fmt(selected.createdAt) }}</small>
          </div>
          <div class="modal__head-ops">
            <button class="exp" @click="printSingleOrder(selected)">🖨 列印出貨單</button>
            <button class="x" @click="close">✕</button>
          </div>
        </header>

        <!-- 訂單狀態 -->
        <section class="sec">
          <div class="sec__title">訂單狀態</div>
          <div class="status-row">
            <select :value="selected.status" @change="store.updateStatus(selected.id, $event.target.value)">
              <option v-for="(label, key) in ORDER_STATUS" :key="key" :value="key">{{ label }}</option>
            </select>
            <button class="link danger" @click="store.cancel(selected.id)">取消訂單</button>
          </div>
        </section>

        <!-- 會員 / 收件 -->
        <section class="sec grid2">
          <div>
            <div class="sec__title">會員</div>
            <p>{{ selected.member.name }}</p>
            <p class="muted">{{ selected.member.email }}</p>
            <p class="muted">{{ selected.member.phone }}</p>
          </div>
          <div>
            <div class="sec__title">收件 / 配送</div>
            <p><strong>{{ SHIPPING_METHOD[selected.shippingMethod] }}</strong></p>
            <p>{{ selected.recipient.name }}・{{ selected.recipient.phone }}</p>
            <p class="muted">{{ selected.recipient.address || '（超商取貨，無地址）' }}</p>
          </div>
        </section>

        <!-- 送禮 -->
        <section v-if="selected.gift" class="sec gift">
          <div class="sec__title">🎁 送禮資訊</div>
          <p>收禮人：{{ selected.gift.recipientName }}・{{ selected.gift.recipientPhone }}</p>
          <p v-if="selected.gift.companyName" class="muted">公司：{{ selected.gift.companyName }}</p>
          <p class="card-msg">「{{ selected.gift.cardMessage }}」</p>
          <p class="muted">希望送達：{{ selected.gift.deliveryDate || '未指定' }} {{ selected.gift.deliverySlot }}</p>
        </section>

        <!-- 商品明細 -->
        <section class="sec">
          <div class="sec__title">商品明細</div>
          <div v-for="(it, i) in selected.items" :key="i" class="line">
            <span>{{ it.productName }} × {{ it.qty }}</span>
            <span>NT$ {{ (it.unitPrice * it.qty).toLocaleString() }}</span>
          </div>
          <div class="line muted"><span>小計</span><span>NT$ {{ selected.subtotal.toLocaleString() }}</span></div>
          <div v-if="selected.discount" class="line muted">
            <span>折扣 {{ selected.couponCode ? `(${selected.couponCode})` : '' }}</span>
            <span>- NT$ {{ selected.discount.toLocaleString() }}</span>
          </div>
          <div class="line muted"><span>運費</span><span>NT$ {{ selected.shippingFee.toLocaleString() }}</span></div>
          <div class="line total"><span>總計</span><span>NT$ {{ selected.total.toLocaleString() }}</span></div>
        </section>

        <!-- 金流（綠界） -->
        <section class="sec">
          <div class="sec__title">
            金流（綠界 ECPay）
            <span class="tag" :class="payClass[selected.payment.status]">{{ PAYMENT_STATUS[selected.payment.status] }}</span>
          </div>
          <div class="kv"><span>付款方式</span><span>{{ selected.payment.method || '—' }}</span></div>
          <div class="kv"><span>綠界交易編號</span><span>{{ selected.payment.ecpayTradeNo || '—' }}</span></div>
          <div class="kv"><span>特店交易編號</span><span>{{ selected.payment.merchantTradeNo || '—' }}</span></div>
          <div class="kv"><span>付款時間</span><span>{{ selected.payment.paidAt ? fmt(selected.payment.paidAt) : '—' }}</span></div>
          <div class="actions">
            <button
              v-if="selected.payment.status === 'UNPAID'"
              class="btn btn--sm"
              @click="store.markPaid(selected.id)"
            >
              標記已付款
            </button>
            <span class="hooknote">🔗 實際由綠界金流 callback 自動更新</span>
          </div>
        </section>

        <!-- 物流（綠界） -->
        <section class="sec">
          <div class="sec__title">
            物流（綠界 ECPay）
            <span class="tag" :class="logiClass[selected.logistics.status]">{{ LOGISTICS_STATUS[selected.logistics.status] }}</span>
          </div>

          <template v-if="selected.shippingMethod === 'TRUCK_DEDICATED'">
            <p class="truck-note">
              🚛 專人貨車外送（大型／脆弱植栽・限台北市／新北市）— 自有車隊<strong>人工安排司機</strong>，不走第三方物流 API。
            </p>
            <div v-if="selected.status === 'ACCEPTED'" class="actions">
              <button class="btn btn--sm" @click="store.updateStatus(selected.id, 'PREPARING')">
                ✓ 已安排司機（確認配送）
              </button>
              <button class="btn btn--sm danger-btn" @click="store.cancel(selected.id)">
                ✗ 無司機可安排（取消）
              </button>
            </div>
            <p v-else class="muted small">目前配送狀態：{{ ORDER_STATUS[selected.status] }}</p>
          </template>
          <template v-else>
            <div class="kv"><span>物流子類型</span><span>{{ selected.logistics.subType || '—' }}</span></div>
            <div class="kv"><span>託運單號</span><span>{{ selected.logistics.trackingNo || '—' }}</span></div>
            <div class="kv"><span>綠界物流編號</span><span>{{ selected.logistics.ecpayLogisticsId || '—' }}</span></div>
            <div v-if="selected.logistics.cvsStore" class="kv">
              <span>取貨門市</span>
              <span>{{ selected.logistics.cvsStore.name }}（{{ selected.logistics.cvsStore.id }}）<br />{{ selected.logistics.cvsStore.address }}</span>
            </div>
            <div class="kv"><span>出貨時間</span><span>{{ selected.logistics.shippedAt ? fmt(selected.logistics.shippedAt) : '—' }}</span></div>
            <div class="actions">
              <button
                v-if="selected.logistics.status === 'PENDING'"
                class="btn btn--sm"
                @click="store.createLogistics(selected.id)"
              >
                建立物流單
              </button>
              <button
                v-else-if="selected.logistics.status === 'CREATED'"
                class="btn btn--sm"
                @click="store.markShipped(selected.id)"
              >
                標記出貨
              </button>
              <span class="hooknote">🔗 實際呼叫綠界物流 API 建單／取號</span>
            </div>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
}
.hint {
  color: var(--color-muted);
  font-size: 0.88rem;
  margin: 0.4rem 0 1.2rem;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 1rem;
}
.search {
  flex: 1 1 240px;
  padding: 0.55rem 0.9rem;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  font: inherit;
}
.sel {
  padding: 0.55rem 0.9rem;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  font: inherit;
  background: var(--color-surface);
}
.exports {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
}
.exports__label {
  font-size: 0.8rem;
  color: var(--color-muted);
  margin-right: 0.2rem;
}
.exp {
  border: 1px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  border-radius: 8px;
  padding: 0.45rem 0.8rem;
  font-size: 0.85rem;
  transition: background 0.15s, color 0.15s;
}
.exp:hover:not(:disabled) {
  background: var(--color-primary);
  color: #fff;
}
.exp:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.modal__head-ops {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.empty {
  color: var(--color-muted);
  padding: 1.5rem 0;
}

/* Grid 表格 */
.otable {
  background: var(--color-surface);
  border-radius: var(--radius);
  overflow: hidden;
}
.otable__head,
.otable__row {
  display: grid;
  grid-template-columns: 1.4fr 1.4fr 0.9fr 0.9fr 1fr 0.9fr 1.1fr;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}
.otable__head {
  font-weight: 600;
  border-bottom: 1px solid var(--color-line);
}
.otable__row {
  border-bottom: 1px solid var(--color-line);
  cursor: pointer;
  transition: background 0.15s;
}
.otable__row:last-child {
  border-bottom: none;
}
.otable__row:hover {
  background: #eef2ea;
}
.otable__row small {
  display: block;
  color: var(--color-muted);
  font-size: 0.76rem;
}
.ta-r {
  text-align: right;
}
.muted {
  color: var(--color-muted);
}

/* 狀態標籤 */
.tag {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.76rem;
  white-space: nowrap;
}
.st-green {
  background: #e3f3e8;
  color: #1f7a45;
}
.st-amber {
  background: #fdf0d9;
  color: #97640d;
}
.st-blue {
  background: #e2eefb;
  color: #1f5aa8;
}
.st-violet {
  background: #ece6fa;
  color: #5b3da8;
}
.st-red {
  background: #fbe4e0;
  color: #b1352a;
}
.st-grey {
  background: #ececec;
  color: #6b6b6b;
}

/* Modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(43, 53, 44, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.5rem 1rem;
  z-index: 200;
  overflow-y: auto;
}
.modal__card {
  background: var(--color-surface);
  border-radius: 14px;
  padding: 1.4rem 1.5rem;
  width: 100%;
  max-width: 560px;
}
.modal__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.6rem;
}
.modal__head h2 {
  margin: 0;
}
.x {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: var(--color-muted);
}
.sec {
  border-top: 1px solid var(--color-line);
  padding: 0.9rem 0;
}
.sec p {
  margin: 0.2rem 0;
}
.sec__title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.status-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.status-row select {
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  font: inherit;
}
.line,
.kv {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.25rem 0;
  font-size: 0.9rem;
}
.kv span:first-child {
  color: var(--color-muted);
  flex: 0 0 auto;
}
.kv span:last-child {
  text-align: right;
}
.line.total {
  font-weight: 700;
  border-top: 1px solid var(--color-line);
  margin-top: 0.3rem;
  padding-top: 0.5rem;
}
.gift {
  background: #f5f1e8;
  border-radius: 10px;
  padding: 0.9rem 1rem;
  border-top: none;
}
.card-msg {
  font-style: italic;
  color: #6a5a3a;
}
.actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 0.7rem;
}
.hooknote {
  font-size: 0.76rem;
  color: var(--color-accent);
}
.truck-note {
  background: #f1f4ef;
  border-left: 3px solid var(--color-primary);
  padding: 0.6rem 0.8rem;
  border-radius: 0 8px 8px 0;
  color: #4a514a;
  font-size: 0.88rem;
}
.btn {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  font: inherit;
}
.btn--sm {
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
}
.danger-btn {
  background: #c0392b;
}
.small {
  font-size: 0.85rem;
}
.btn--ghost {
  background: transparent;
  color: var(--color-muted);
  border: 1px solid var(--color-line);
}
.link {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-primary);
}
.link.danger {
  color: #c0392b;
}

/* ---- 手機：表格改卡片式 ---- */
@media (max-width: 760px) {
  .otable__head {
    display: none;
  }
  .otable__row {
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem 0.8rem;
    padding: 0.9rem;
  }
  .otable__row > div[data-label]::before {
    content: attr(data-label) '：';
    color: var(--color-muted);
    font-size: 0.76rem;
    margin-right: 0.3rem;
  }
  .otable__row > div:first-child {
    grid-column: 1 / -1;
  }
  .ta-r {
    text-align: left;
  }
}
@media (max-width: 480px) {
  .grid2 {
    grid-template-columns: 1fr;
  }
  .otable__row {
    grid-template-columns: 1fr;
  }
}
</style>
