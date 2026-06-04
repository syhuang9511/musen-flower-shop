/**
 * 訂單匯出工具：CSV（免套件）、Excel(.xlsx)（動態載入 SheetJS）、PDF（瀏覽器列印）。
 * 三者皆以「目前傳入的訂單陣列」為範圍，中文均正常顯示。
 */
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  LOGISTICS_STATUS,
  SHIPPING_METHOD,
} from '@/stores/orderAdmin'

function fmt(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function stamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`
}

/** 將一筆訂單攤平成一列（鍵 = 欄位標題） */
function toRow(o) {
  return {
    訂單編號: o.orderNo,
    下單時間: fmt(o.createdAt),
    會員: o.member.name,
    Email: o.member.email,
    電話: o.member.phone,
    訂單狀態: ORDER_STATUS[o.status] || o.status,
    付款狀態: PAYMENT_STATUS[o.payment.status] || o.payment.status,
    付款方式: o.payment.method || '',
    綠界交易編號: o.payment.ecpayTradeNo || '',
    付款時間: fmt(o.payment.paidAt),
    配送方式: SHIPPING_METHOD[o.shippingMethod] || o.shippingMethod,
    物流狀態: LOGISTICS_STATUS[o.logistics.status] || o.logistics.status,
    託運單號: o.logistics.trackingNo || '',
    取貨門市: o.logistics.cvsStore
      ? `${o.logistics.cvsStore.name}(${o.logistics.cvsStore.id})`
      : '',
    收件人: o.recipient.name,
    收件電話: o.recipient.phone,
    收件地址: o.recipient.address || '',
    商品明細: o.items.map((i) => `${i.productName} x${i.qty}`).join('; '),
    小計: o.subtotal,
    折扣: o.discount,
    運費: o.shippingFee,
    總計: o.total,
    優惠券: o.couponCode || '',
    送禮賀詞: o.gift?.cardMessage || '',
  }
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** 匯出 CSV（UTF-8 BOM，Excel 可直接開、中文正常） */
export function exportOrdersCsv(orders) {
  const rows = orders.map(toRow)
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const esc = (v) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(',')),
  ].join('\r\n')
  download(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }), `訂單_${stamp()}.csv`)
}

/** 匯出 Excel（.xlsx，動態載入 SheetJS） */
export async function exportOrdersXlsx(orders) {
  const rows = orders.map(toRow)
  if (!rows.length) return
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(rows)
  // 依標題長度給個合理欄寬
  ws['!cols'] = Object.keys(rows[0]).map((h) => ({
    wch: Math.min(40, Math.max(h.length * 2 + 2, 10)),
  }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '訂單')
  XLSX.writeFile(wb, `訂單_${stamp()}.xlsx`)
}

/** 列印（另存 PDF）：開新視窗印出訂單清單表格，中文正常 */
export function printOrders(orders, title = '訂單清單') {
  const rows = orders.map(toRow)
  const cols = ['訂單編號', '下單時間', '會員', '訂單狀態', '付款狀態', '物流狀態', '託運單號', '總計']
  const thead = cols.map((c) => `<th>${c}</th>`).join('')
  const tbody = rows
    .map(
      (r) =>
        `<tr>${cols.map((c) => `<td>${c === '總計' ? 'NT$ ' + Number(r[c]).toLocaleString() : esc(r[c])}</td>`).join('')}</tr>`,
    )
    .join('')
  writePrintWindow(
    `${title}（${rows.length} 筆）`,
    `<table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`,
  )
}

/** 列印單筆訂單明細 / 出貨單 */
export function printSingleOrder(o) {
  const r = toRow(o)
  const kv = (k, v) => `<div class="kv"><span>${k}</span><span>${esc(v)}</span></div>`
  const items = o.items
    .map(
      (i) =>
        `<tr><td>${esc(i.productName)}</td><td class="r">${i.qty}</td><td class="r">NT$ ${(i.unitPrice * i.qty).toLocaleString()}</td></tr>`,
    )
    .join('')
  const gift = o.gift
    ? `<h3>送禮資訊</h3>${kv('收禮人', `${o.gift.recipientName}・${o.gift.recipientPhone}`)}${kv('賀詞', o.gift.cardMessage)}${kv('指定送達', o.gift.deliverySlot)}`
    : ''
  const body = `
    <h2>沐森植研所 — 出貨單</h2>
    <div class="row">
      <div>
        <h3>訂單</h3>
        ${kv('訂單編號', r.訂單編號)}${kv('下單時間', r.下單時間)}${kv('訂單狀態', r.訂單狀態)}
      </div>
      <div>
        <h3>金流 / 物流</h3>
        ${kv('付款狀態', r.付款狀態)}${kv('付款方式', r.付款方式)}${kv('配送方式', r.配送方式)}${kv('物流狀態', r.物流狀態)}${kv('託運單號', r.託運單號 || '—')}
      </div>
    </div>
    <h3>收件 / 配送</h3>
    ${kv('收件人', `${r.收件人}・${r.收件電話}`)}${kv('地址 / 門市', r.收件地址 || r.取貨門市 || '—')}
    ${gift}
    <h3>商品明細</h3>
    <table><thead><tr><th>商品</th><th class="r">數量</th><th class="r">小計</th></tr></thead>
      <tbody>${items}</tbody></table>
    <div class="totals">
      ${kv('小計', 'NT$ ' + Number(r.小計).toLocaleString())}
      ${o.discount ? kv('折扣', '- NT$ ' + Number(r.折扣).toLocaleString()) : ''}
      ${kv('運費', 'NT$ ' + Number(r.運費).toLocaleString())}
      <div class="kv grand"><span>應付總額</span><span>NT$ ${Number(r.總計).toLocaleString()}</span></div>
    </div>`
  writePrintWindow(`出貨單 ${r.訂單編號}`, body, true)
}

function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function writePrintWindow(title, innerHtml, single = false) {
  const w = window.open('', '_blank', 'width=900,height=700')
  if (!w) {
    alert('瀏覽器封鎖了列印視窗，請允許彈出視窗後再試一次。')
    return
  }
  w.document.write(`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8" />
    <title>${esc(title)}</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: "Noto Sans TC","Microsoft JhengHei",sans-serif; color:#2d332d; padding:24px; }
      h1,h2 { margin:0 0 4px; }
      h3 { margin:16px 0 6px; font-size:14px; border-bottom:1px solid #ccc; padding-bottom:3px; }
      .meta { color:#888; font-size:12px; margin-bottom:14px; }
      table { width:100%; border-collapse:collapse; font-size:12px; margin-top:6px; }
      th,td { border:1px solid #ddd; padding:6px 8px; text-align:left; }
      th { background:#f0f2ee; }
      td.r, th.r { text-align:right; }
      .row { display:flex; gap:32px; }
      .row > div { flex:1; }
      .kv { display:flex; justify-content:space-between; font-size:13px; padding:3px 0; gap:12px; }
      .kv span:first-child { color:#888; }
      .totals { margin-top:10px; max-width:300px; margin-left:auto; }
      .kv.grand { font-weight:700; font-size:15px; border-top:1px solid #999; margin-top:4px; padding-top:6px; }
      @media print { body { padding:0; } @page { margin:14mm; } }
    </style></head>
    <body onload="window.print()">
      ${single ? '' : `<h1>${esc(title)}</h1>`}
      <p class="meta">沐森植研所 MUSEN ・ 匯出時間 ${esc(fmt(new Date().toISOString()))}</p>
      ${innerHtml}
    </body></html>`)
  w.document.close()
}
