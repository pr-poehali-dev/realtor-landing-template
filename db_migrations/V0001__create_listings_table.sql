CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  area INTEGER NOT NULL,
  price BIGINT NOT NULL,
  price_type TEXT NOT NULL DEFAULT 'month',
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  floor TEXT,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO listings (title, category, area, price, price_type, address, description, photos, floor, features) VALUES
(
  'Офисный блок в бизнес-центре класса B+',
  'Офисы', 185, 85000, 'month',
  'ул. Ленина, 24, этаж 7',
  'Открытая планировка с переговорной комнатой. Отдельный вход с этажа, парковочные места в подземном паркинге. Свежий ремонт, вся инфраструктура БЦ.',
  ARRAY['https://cdn.poehali.dev/projects/14ab8a9c-f7f7-4f5b-acc4-7ade119a8a4c/files/e26283e0-ffc0-4a27-9427-c92236c173d3.jpg'],
  '7 из 14',
  ARRAY['Парковка', 'Охрана 24/7', 'Кондиционирование', 'Оптика']
),
(
  'Отапливаемый склад с рампой',
  'Склады', 620, 180000, 'month',
  'пр. Промышленный, 8',
  'Высота потолков 8м, ворота 4×4м, рампа для фур. Ж/д ветка в 300м. Офисный блок 40 кв.м. в составе. Возможна аренда от 200 кв.м.',
  ARRAY['https://cdn.poehali.dev/projects/14ab8a9c-f7f7-4f5b-acc4-7ade119a8a4c/files/df668269-89ca-4d02-ae47-ba82350bace8.jpg'],
  '1 этаж',
  ARRAY['Отопление', 'Рампа', 'Видеонаблюдение', 'Пожарная сигнализация']
),
(
  'Торговое помещение в ТЦ, 1 линия',
  'Под магазин', 95, 120000, 'month',
  'ул. Торговая, 12, ТЦ «Меридиан»',
  'Стрит-ретейл, витринное остекление на оживлённый проспект. Пешеходный трафик 8000+ чел/день. Отдельный вход, своя терраса.',
  ARRAY['https://cdn.poehali.dev/projects/14ab8a9c-f7f7-4f5b-acc4-7ade119a8a4c/files/e3bbc6b7-b7d5-4dee-9e90-67ff93534e08.jpg'],
  '1 этаж',
  ARRAY['Витрина', 'Отдельный вход', 'Высокий трафик']
);
