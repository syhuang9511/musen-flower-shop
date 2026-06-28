<template>
  <div class="container policy" style="padding: 2rem 1rem">
    <h1>退換貨政策</h1>
    <p class="policy__intro">
      沐森植研所重視每一位顧客的購物體驗。以下政策依據<strong>消費者保護法</strong>制定，
      請於下單前詳閱，以保障您的權益。
    </p>

    <section class="policy__section">
      <h2>🌸 鮮花花束類</h2>
      <p>
        鮮花屬於生鮮易逝商品，<strong>不適用七天猶豫期</strong>（消保法第19條但書）。
      </p>
      <ul>
        <li>若收到時花材有明顯枯萎、損傷，請於<strong>收貨當日拍照存證</strong>並聯絡客服。</li>
        <li>經確認為配送過程損壞，我們將安排<strong>補送或全額退款</strong>。</li>
        <li>因花材為天然植物，色澤、形態與圖片可能略有差異，不視為瑕疵。</li>
      </ul>
    </section>

    <section class="policy__section">
      <h2>🌿 盆栽植物類</h2>
      <p>
        活體植物依消保法列為例外商品，<strong>不適用七天猶豫期</strong>。
      </p>
      <ul>
        <li>收貨時請即時檢查，若植株有死亡、嚴重損傷，請於<strong>收貨當日</strong>聯絡客服並附照片。</li>
        <li>植物後續因照護不當（缺水、曬傷、蟲害）導致的問題，不在退換範圍內。</li>
        <li>大型落地植栽由專人配送，現場確認無誤後請當場告知，事後恕難受理。</li>
      </ul>
    </section>

    <section class="policy__section">
      <h2>📦 盆器資材類</h2>
      <p>
        盆器、肥料、介質等一般資材，符合消保法規定，享有<strong>七天猶豫期</strong>。
      </p>
      <ul>
        <li>商品須保持<strong>未拆封、未使用、附原包裝</strong>，方可辦理退貨。</li>
        <li>退貨運費由顧客自行負擔（非瑕疵品）。</li>
        <li>若商品有瑕疵，運費由我方承擔，並提供換貨或退款。</li>
      </ul>
    </section>

    <section class="policy__section">
      <h2>🎁 祝賀花禮 / 客製化商品</h2>
      <ul>
        <li>客製化花禮（加字、特殊造型等）因個人化需求，<strong>不適用猶豫期</strong>。</li>
        <li>若花禮到達時有損壞，請於<strong>收貨當日</strong>提供照片聯絡客服處理。</li>
      </ul>
    </section>

    <section class="policy__section">
      <h2>📋 退換貨流程</h2>
      <ol class="policy__steps">
        <li>收貨後發現問題，請<strong>拍照記錄</strong>（商品本體、外包裝）。</li>
        <li>於<strong>收貨當日（鮮花 / 植栽）</strong>或<strong>七日內（資材）</strong>聯絡客服。</li>
        <li>客服確認後，提供退換貨方式（補送 / 換貨 / 退款）。</li>
        <li>退款將於確認後 <strong>7 個工作天</strong>原路退回。</li>
      </ol>
    </section>

    <div class="policy__contact">
      <p>如有任何疑問，歡迎透過以下方式聯絡我們：</p>
      <p>📞 客服電話：<a href="tel:0975962880">0975-962-880</a></p>
      <p>🕘 服務時間：每日 09:00 - 18:00</p>
    </div>
  </div>
</template>

<style scoped>
.policy h1 {
  margin-bottom: 0.8rem;
}
.policy__intro {
  color: #4a514a;
  line-height: 1.9;
  margin-bottom: 2rem;
  padding: 1rem 1.2rem;
  background: var(--color-surface);
  border-left: 4px solid var(--color-accent);
  border-radius: 0 8px 8px 0;
}
.policy__section {
  margin-bottom: 2rem;
  padding: 1.4rem 1.6rem;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 12px;
}
.policy__section h2 {
  margin: 0 0 0.8rem;
  font-size: 1.05rem;
}
.policy__section p {
  color: #4a514a;
  line-height: 1.85;
  margin: 0 0 0.6rem;
}
.policy__section ul,
.policy__section ol {
  margin: 0;
  padding-left: 1.2rem;
  color: #4a514a;
  line-height: 1.9;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.policy__steps {
  counter-reset: step;
}
.policy__steps li {
  line-height: 1.85;
}
.policy__contact {
  margin-top: 2rem;
  padding: 1.2rem 1.6rem;
  background: var(--color-primary-dark);
  color: #d6dcd2;
  border-radius: 12px;
  line-height: 2;
}
.policy__contact a {
  color: var(--color-accent);
  font-weight: 600;
}
</style>
