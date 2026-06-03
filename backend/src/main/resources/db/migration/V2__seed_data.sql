-- =============================================================
-- 種子資料：管理員、示範商品、優惠券、Q&A
-- =============================================================

-- 管理員（密碼為 bcrypt('admin1234')，請於正式環境更換）
INSERT INTO members (email, password_hash, name, role, email_verified)
VALUES ('admin@floralshop.test',
        '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5oTSjVbnaQXY8sQ7Q1tQ0fJ2rJ2fG',
        '系統管理員', 'ADMIN', TRUE);

-- 示範商品：涵蓋三種物流類別
INSERT INTO products (name, description, price, image, stock, logistics_class, featured) VALUES
('多肉植物小品盆栽', '小巧療癒的桌上多肉，葉片飽滿圓潤、自帶霧面質感。極耐旱好照顧，約每 7–10 天待介質乾透再澆水即可，明亮散射光下生長最佳。隨盆附素燒小盆與底盤。', 380, 'https://picsum.photos/seed/succulent/600', 50, 'GENERAL', TRUE),
('有機營養土 5L',   '嚴選椰纖、泥炭土與珍珠石調配的通用型介質，疏鬆透氣、保水卻不積水，能有效降低爛根風險。pH 值溫和、未添加化學肥料，新手也能輕鬆上手。容量 5 公升。',  220, 'https://picsum.photos/seed/soil/600',      100, 'GENERAL', FALSE),
('陶瓷花盆 (中)',    '簡約無印風格的陶瓷盆器，霧面釉色耐看百搭。盆底附排水孔與專屬底盤，兼顧美感與植物健康。盆口直徑約 15cm，適合中型觀葉植物或多株多肉組盆。',          290, 'https://picsum.photos/seed/pot/600',        80, 'GENERAL', FALSE),
('大型龜背芋落地盆栽', '高度約 120cm 的室內綠化首選，葉片碩大、裂葉造型俐落，是空間的視覺焦點。耐陰好照顧，明亮散射光下生長最佳。因株型高大、葉片易折，由專人貨車運送並協助擺位。',   2680, 'https://picsum.photos/seed/monstera/600',  12, 'BULKY',   TRUE),
('開幕祝賀大花籃',    '商務祝賀首選的大型花籃，選用當季鮮花搭配蘭花，氣派隆重。含賀詞卡片代寫服務，可指定送達時間。因體積龐大且鮮花脆弱，一律由專人貨車配送並現場擺放。',      3880, 'https://picsum.photos/seed/basket/600',     8, 'BULKY',   TRUE),
('當季鮮花花束 (大)', '每日清晨進貨的當季鮮花，由花藝師手工綁製，層次豐富、色系雅緻。附保水包裝與照護小卡。鮮花嬌嫩易損，僅提供專人貨車配送，避免運送碰撞影響品質。',        1580, 'https://picsum.photos/seed/bouquet/600',   20, 'FRAGILE', TRUE);

-- 示範優惠券
INSERT INTO coupons (code, name, type, value, min_spend, total_quantity, per_user_limit, valid_until)
VALUES
('WELCOME100', '新會員滿千折百', 'FIXED',      100, 1000, 1000, 1, now() + INTERVAL '90 days'),
('SPRING15',   '春季 85 折',     'PERCENTAGE',  15,  800,  500, 1, now() + INTERVAL '30 days'),
('FREESHIP',   '免運券',         'FREE_SHIPPING', 0,  0,  200, 2, now() + INTERVAL '60 days');

-- Q&A 分類與內容
INSERT INTO qa_categories (id, name, sort_order) VALUES
(1, '多肉植物', 1),
(2, '觀葉植物', 2),
(3, '鮮花花束', 3);

INSERT INTO qa_articles (category_id, question, answer, published_at) VALUES
(1, '多肉多久澆一次水？', '一般 7-10 天澆一次，待介質完全乾透再給水，避免積水爛根。', now()),
(2, '龜背芋葉子發黃怎麼辦？', '多為澆水過多或日照不足，建議移至明亮散射光處並調整澆水頻率。', now()),
(3, '收到鮮花後如何延長壽命？', '斜剪花腳 2-3 公分，每 1-2 天換水並修剪，避免陽光直射與電器熱源。', now());
