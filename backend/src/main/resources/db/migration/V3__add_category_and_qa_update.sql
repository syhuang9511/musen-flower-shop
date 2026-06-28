-- ============================================================
-- V3: 商品分類欄位、Q&A 圖片欄位、更新種子資料、新增管理員帳號
-- ============================================================

-- ── Products: 新增分類欄位 ──────────────────────────────────
ALTER TABLE products ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT '未分類' AFTER name;

UPDATE products SET category = '多肉植物'  WHERE name LIKE '%多肉%';
UPDATE products SET category = '盆器資材'  WHERE name LIKE '%土%';
UPDATE products SET category = '盆器資材'  WHERE name LIKE '%花盆%' OR name LIKE '%花器%';
UPDATE products SET category = '觀葉植物'  WHERE name LIKE '%龜背%' OR name LIKE '%虎尾%';
UPDATE products SET category = '祝賀花禮'  WHERE name LIKE '%花籃%';
UPDATE products SET category = '鮮花花束'  WHERE name LIKE '%花束%';

-- ── QA Categories: 改為主題分類 ────────────────────────────
UPDATE qa_categories SET name = '澆水與水分管理' WHERE id = 1;
UPDATE qa_categories SET name = '環境與光照'     WHERE id = 2;
UPDATE qa_categories SET name = '施肥與養分管理' WHERE id = 3;
INSERT INTO qa_categories (id, name, sort_order) VALUES (4, '大型植栽與祝賀花禮', 4);

-- ── QA Articles: 新增圖片欄位 ──────────────────────────────
ALTER TABLE qa_articles ADD COLUMN image VARCHAR(512) AFTER answer;

-- ── QA Articles: 更新內容與圖片 ────────────────────────────
UPDATE qa_articles SET
    category_id = 1,
    question    = '請問這盆植物多久需要澆一次水？該怎麼澆？',
    answer      = '澆水的頻率與方式會因為「植栽種類」而有很大的不同！例如：多肉與仙人掌極度耐旱，必須等土壤「完全乾燥」才能再次澆水；而多數觀葉植物則喜歡微濕潤，通常是「表土微乾就澆透」。\n\n通用小訣竅：將手指或木棒插入土壤約兩個指節深，感覺沒有濕潤感就可以澆水了。澆水時請緩慢均勻地澆灌，直到水從盆底流出，並務必將底盤的積水倒掉，保持根部透氣。',
    image       = 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=900&q=60'
WHERE id = 1;

UPDATE qa_articles SET
    category_id = 2,
    question    = '請問「明亮散射光」是什麼意思？冷氣房可以養植物嗎？',
    answer      = '「明亮散射光」指的是植物能感受到充足的自然光，但不會被太陽直射烤傷的位置（例如：隔著透光薄窗簾的窗邊）。冷氣房絕對是可以養植栽的！但請務必避開冷氣出風口「直吹」的位置。若室內空氣較乾燥，對於喜歡濕潤的觀葉植物，可以在其周圍噴霧來局部增加空氣濕度。',
    image       = 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=60'
WHERE id = 2;

UPDATE qa_articles SET
    category_id = 3,
    question    = '植物一定要施肥嗎？肥料該怎麼使用？',
    answer      = '是的，施肥對植物的健康成長是絕對必要的！盆栽內的土壤養分有限，隨著植物生長與日常澆水，養分會逐漸流失，因此必須定期補充。\n\n使用方式：由於每種肥料的成分與濃度不同，請務必依照您所購買的肥料包裝上標示的「建議濃度」與「施肥週期」來進行。春夏成長季是植物最需要養分的時候；若使用液體肥料，請務必按比例稀釋，避免濃度過高造成肥傷。',
    image       = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=60'
WHERE id = 3;

INSERT INTO qa_articles (category_id, question, answer, image, published_at) VALUES (
    4,
    '剛收到的開幕蘭花或大型落地盆栽，該怎麼照顧？',
    '蘭花喜歡通風且明亮但不直曬的環境，澆水時請少量澆在根部的「水苔」上，避開花朵與葉心，約 7-10 天澆一次即可。至於大型落地盆栽，如果一開始就適應了室內明亮處，請「不要」頻繁推去室外曬太陽，突然移到室外強光下非常容易曬傷葉片。日常只要定期用濕布輕輕擦拭葉面灰塵，保持毛孔暢通即可。',
    'https://images.unsplash.com/photo-1567748157439-651aca2ff064?auto=format&fit=crop&w=900&q=60',
    NOW()
);

-- ── 管理員帳號：yun (密碼 1234) ────────────────────────────
INSERT INTO members (email, password_hash, name, role, email_verified)
VALUES ('yun@floralshop.test',
        '$2a$10$IPd.IRxZcHWUaUPVztIvbOnWHqY1wgMoVs3jcu.AGm/RlXitwZSA.',
        '小花', 'ADMIN', TRUE);
