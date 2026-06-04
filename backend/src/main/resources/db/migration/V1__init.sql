-- =============================================================
-- 花店智慧電商系統 — 初始 schema (MySQL 8)
-- =============================================================

-- ---- 會員 (4. 會員系統) ----
CREATE TABLE members (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255),
    name           VARCHAR(100),
    phone          VARCHAR(30),
    auth_provider  VARCHAR(16)  NOT NULL DEFAULT 'LOCAL',  -- LOCAL / GOOGLE / LINE
    provider_uid   VARCHAR(128),
    line_user_id   VARCHAR(128),
    role           VARCHAR(16)  NOT NULL DEFAULT 'MEMBER', -- MEMBER / ADMIN
    points         INT          NOT NULL DEFAULT 0,
    email_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_members_provider ON members (auth_provider, provider_uid);

-- 4.2 常用收件地址
CREATE TABLE member_addresses (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id      BIGINT NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    phone          VARCHAR(30)  NOT NULL,
    address        VARCHAR(255) NOT NULL,
    is_default     BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_addresses_member FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);
CREATE INDEX idx_addresses_member ON member_addresses (member_id);

-- ---- 商品 (5.1 物流類別) ----
CREATE TABLE products (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    price           DECIMAL(10, 2) NOT NULL,
    image           VARCHAR(512),
    stock           INT NOT NULL DEFAULT 0,
    logistics_class VARCHAR(16) NOT NULL DEFAULT 'GENERAL', -- GENERAL / BULKY / FRAGILE
    volume_weight   INT DEFAULT 0,
    featured        BOOLEAN NOT NULL DEFAULT FALSE,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_active ON products (active);

-- ---- 優惠券 (5.3 / 7.2) ----
CREATE TABLE coupons (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    code           VARCHAR(64) NOT NULL UNIQUE,
    name           VARCHAR(100),
    type           VARCHAR(16) NOT NULL,                -- FIXED / PERCENTAGE / FREE_SHIPPING
    value          DECIMAL(10, 2),
    min_spend      DECIMAL(10, 2) DEFAULT 0,
    total_quantity INT,
    per_user_limit INT DEFAULT 1,
    valid_from     DATETIME,
    valid_until    DATETIME,
    active         BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE coupon_usages (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    order_id  BIGINT,
    used_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usage_coupon FOREIGN KEY (coupon_id) REFERENCES coupons (id),
    CONSTRAINT fk_usage_member FOREIGN KEY (member_id) REFERENCES members (id)
);
CREATE INDEX idx_coupon_usage ON coupon_usages (coupon_id, member_id);

-- ---- 訂單 (4.2 / 5.2) ----
CREATE TABLE orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no        VARCHAR(40) NOT NULL UNIQUE,
    member_id       BIGINT NOT NULL,
    status          VARCHAR(16) NOT NULL DEFAULT 'ACCEPTED',
    shipping_method VARCHAR(24) NOT NULL,                -- CVS_711 / HOME_DELIVERY / TRUCK_DEDICATED
    recipient_name  VARCHAR(100),
    recipient_phone VARCHAR(30),
    address         VARCHAR(255),
    subtotal        DECIMAL(10, 2),
    discount        DECIMAL(10, 2) DEFAULT 0,
    shipping_fee    DECIMAL(10, 2) DEFAULT 0,
    total           DECIMAL(10, 2),
    coupon_code     VARCHAR(64),
    is_gift         BOOLEAN NOT NULL DEFAULT FALSE,
    -- 5.2 送禮客製化（內嵌欄位）
    gift_recipient_name  VARCHAR(100),
    gift_recipient_phone VARCHAR(30),
    gift_company_name    VARCHAR(150),
    gift_card_message    TEXT,
    gift_delivery_slot   VARCHAR(20),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_member FOREIGN KEY (member_id) REFERENCES members (id)
);
CREATE INDEX idx_orders_member ON orders (member_id, created_at);

CREATE TABLE order_items (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id     BIGINT NOT NULL,
    product_id   BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price   DECIMAL(10, 2) NOT NULL,
    qty          INT NOT NULL,
    CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);
CREATE INDEX idx_order_items_order ON order_items (order_id);

-- ---- 收藏 (6.1) ----
CREATE TABLE wishlist_items (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id  BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_wishlist UNIQUE (member_id, product_id),
    CONSTRAINT fk_wishlist_member  FOREIGN KEY (member_id)  REFERENCES members (id)  ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

-- ---- 養護 Q&A (3.2 / 7.1) ----
CREATE TABLE qa_categories (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE TABLE qa_articles (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id  BIGINT,
    question     VARCHAR(255) NOT NULL,
    answer       TEXT NOT NULL,
    sort_order   INT DEFAULT 0,
    published_at DATETIME,
    unpublish_at DATETIME,
    CONSTRAINT fk_qa_category FOREIGN KEY (category_id) REFERENCES qa_categories (id)
);
CREATE INDEX idx_qa_category ON qa_articles (category_id);

-- ---- 購物車棄單追蹤 (7.3) ----
CREATE TABLE cart_snapshots (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id   BIGINT,
    items_json  TEXT NOT NULL,            -- 序列化購物車內容
    checked_out BOOLEAN NOT NULL DEFAULT FALSE,
    reminded    BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_member FOREIGN KEY (member_id) REFERENCES members (id)
);
CREATE INDEX idx_cart_abandon ON cart_snapshots (checked_out, updated_at);
