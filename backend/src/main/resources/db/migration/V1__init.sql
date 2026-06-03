-- =============================================================
-- 花店智慧電商系統 — 初始 schema (PostgreSQL)
-- =============================================================

-- ---- 會員 (4. 會員系統) ----
CREATE TABLE members (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    name          VARCHAR(100),
    phone         VARCHAR(30),
    auth_provider VARCHAR(16)  NOT NULL DEFAULT 'LOCAL',  -- LOCAL / GOOGLE / LINE
    provider_uid  VARCHAR(128),
    line_user_id  VARCHAR(128),
    role          VARCHAR(16)  NOT NULL DEFAULT 'MEMBER', -- MEMBER / ADMIN
    points        INTEGER      NOT NULL DEFAULT 0,
    email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_members_provider ON members (auth_provider, provider_uid);

-- 4.2 常用收件地址
CREATE TABLE member_addresses (
    id             BIGSERIAL PRIMARY KEY,
    member_id      BIGINT NOT NULL REFERENCES members (id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    phone          VARCHAR(30)  NOT NULL,
    address        VARCHAR(255) NOT NULL,
    is_default     BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_addresses_member ON member_addresses (member_id);

-- ---- 商品 (5.1 物流類別) ----
CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    price           NUMERIC(10, 2) NOT NULL,
    image           VARCHAR(512),
    stock           INTEGER NOT NULL DEFAULT 0,
    logistics_class VARCHAR(16) NOT NULL DEFAULT 'GENERAL', -- GENERAL / BULKY / FRAGILE
    volume_weight   INTEGER DEFAULT 0,
    featured        BOOLEAN NOT NULL DEFAULT FALSE,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_active ON products (active);

-- ---- 優惠券 (5.3 / 7.2) ----
CREATE TABLE coupons (
    id             BIGSERIAL PRIMARY KEY,
    code           VARCHAR(64) NOT NULL UNIQUE,
    name           VARCHAR(100),
    type           VARCHAR(16) NOT NULL,                -- FIXED / PERCENTAGE / FREE_SHIPPING
    value          NUMERIC(10, 2),
    min_spend      NUMERIC(10, 2) DEFAULT 0,
    total_quantity INTEGER,
    per_user_limit INTEGER DEFAULT 1,
    valid_from     TIMESTAMPTZ,
    valid_until    TIMESTAMPTZ,
    active         BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE coupon_usages (
    id        BIGSERIAL PRIMARY KEY,
    coupon_id BIGINT NOT NULL REFERENCES coupons (id),
    member_id BIGINT NOT NULL REFERENCES members (id),
    order_id  BIGINT,
    used_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_coupon_usage ON coupon_usages (coupon_id, member_id);

-- ---- 訂單 (4.2 / 5.2) ----
CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    order_no        VARCHAR(40) NOT NULL UNIQUE,
    member_id       BIGINT NOT NULL REFERENCES members (id),
    status          VARCHAR(16) NOT NULL DEFAULT 'ACCEPTED',
    shipping_method VARCHAR(24) NOT NULL,                -- CVS_711 / HOME_DELIVERY / TRUCK_DEDICATED
    recipient_name  VARCHAR(100),
    recipient_phone VARCHAR(30),
    address         VARCHAR(255),
    subtotal        NUMERIC(10, 2),
    discount        NUMERIC(10, 2) DEFAULT 0,
    shipping_fee    NUMERIC(10, 2) DEFAULT 0,
    total           NUMERIC(10, 2),
    coupon_code     VARCHAR(64),
    is_gift         BOOLEAN NOT NULL DEFAULT FALSE,
    -- 5.2 送禮客製化（內嵌欄位）
    gift_recipient_name  VARCHAR(100),
    gift_recipient_phone VARCHAR(30),
    gift_company_name    VARCHAR(150),
    gift_card_message    TEXT,
    gift_delivery_slot   VARCHAR(20),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_member ON orders (member_id, created_at DESC);

CREATE TABLE order_items (
    id           BIGSERIAL PRIMARY KEY,
    order_id     BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id   BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price   NUMERIC(10, 2) NOT NULL,
    qty          INTEGER NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items (order_id);

-- ---- 收藏 (6.1) ----
CREATE TABLE wishlist_items (
    id         BIGSERIAL PRIMARY KEY,
    member_id  BIGINT NOT NULL REFERENCES members (id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (member_id, product_id)
);

-- ---- 養護 Q&A (3.2 / 7.1) ----
CREATE TABLE qa_categories (
    id        BIGSERIAL PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE qa_articles (
    id           BIGSERIAL PRIMARY KEY,
    category_id  BIGINT REFERENCES qa_categories (id),
    question     VARCHAR(255) NOT NULL,
    answer       TEXT NOT NULL,
    sort_order   INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    unpublish_at TIMESTAMPTZ
);
CREATE INDEX idx_qa_category ON qa_articles (category_id);

-- ---- 購物車棄單追蹤 (7.3) ----
CREATE TABLE cart_snapshots (
    id          BIGSERIAL PRIMARY KEY,
    member_id   BIGINT REFERENCES members (id),
    items_json  TEXT NOT NULL,            -- 序列化購物車內容
    checked_out BOOLEAN NOT NULL DEFAULT FALSE,
    reminded    BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_cart_abandon ON cart_snapshots (checked_out, updated_at);
