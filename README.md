# 花店新一代官網暨智慧電商系統

精品花店數位官網暨電商平台 — 前後端分離架構，解決雙軌物流（一般資材 / 大型脆弱植栽）與多管道會員管理痛點。

## 技術棧

| 層級 | 技術 |
| --- | --- |
| 前端 | Vue 3 (Composition API) + Vite + Vue Router + Pinia + Axios |
| 後端 | Java 17 + Spring Boot 3 + Spring Security + Spring Data JPA |
| 資料庫 | PostgreSQL 16（Flyway 管理 schema 版本） |
| 金流 | 綠界科技 ECPay |
| 第三方 | Google OAuth、LINE Login & Messaging API、EmailJS |

## 專案結構（monorepo）

```
flower-shop/
├── frontend/          # Vue 3 + Vite SPA
├── backend/           # Spring Boot RESTful API
├── docker-compose.yml # 本機 PostgreSQL + Adminer
└── README.md
```

## 開發環境需求

- **Node.js 20+**（已驗證 v24）
- **JDK 17+**（後端編譯執行所需 — 目前本機尚未安裝，請先安裝 Temurin/OpenJDK 17）
- **Docker**（可選，用於快速啟動本機 PostgreSQL）

> ⚠️ 本機目前未偵測到 Java / Maven。後端骨架已建立完成，安裝 JDK 17 後即可透過內附的 Maven Wrapper（`./mvnw`）編譯執行，無需另外安裝 Maven。

## 快速開始

### 1. 啟動資料庫（可選）

```bash
docker compose up -d
# PostgreSQL → localhost:5432 (db: floralshop / user: floral / pwd: floral)
# Adminer    → http://localhost:8080
```

### 2. 後端

```bash
cd backend
cp src/main/resources/application-example.yml src/main/resources/application-local.yml
# 填入 ECPay / Google / LINE 等金鑰
./mvnw spring-boot:run            # 預設 http://localhost:8081
```

### 3. 前端

```bash
cd frontend
cp .env.example .env.local        # 設定 VITE_API_BASE_URL 等
npm install
npm run dev                       # http://localhost:5173
```

## 模組對應需求規格書

| 規格章節 | 前端 | 後端模組 |
| --- | --- | --- |
| 3. 前台展示 | `views/home`, `views/qa`, `views/contact` | `content` |
| 4. 會員系統 | `views/member`, `stores/auth` | `member`, `auth` |
| 5.1 智慧物流過濾 ⭐ | `stores/cart`, `views/checkout` | `cart` (LogisticsRuleService) |
| 5.2 送禮客製化 | `components/checkout/GiftForm.vue` | `order` (GiftInfo) |
| 5.3 優惠券引擎 | `views/checkout` | `coupon` |
| 6. 收藏與交叉銷售 | `stores/wishlist` | `wishlist` |
| 7. 後台管理 | `views/admin/*` | `admin/*` |
| 8. 資安 | Axios interceptor、HTML escape | `SecurityConfig`、Rate Limiting |

## 核心亮點：智慧物流過濾邏輯

依「**最高物流限制原則**」：購物車中只要含任一大型/脆弱商品（`logistics_class = BULKY` 或 `FRAGILE`），
全車強制鎖定「專人貨車外送」並停用超商取貨。實作位於
`backend/.../cart/service/LogisticsRuleService.java` 與前端 `frontend/src/stores/cart.js`。
