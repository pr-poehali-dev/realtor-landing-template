import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

/* ─── Types ─── */
interface Listing {
  id: number;
  title: string;
  category: string;
  area: number;
  price: number;
  priceType: "month" | "sale";
  address: string;
  description: string;
  photos: string[];
  floor?: string;
  features?: string[];
}

/* ─── Seed data ─── */
const SEED_LISTINGS: Listing[] = [
  {
    id: 1,
    title: "Офисный блок в бизнес-центре класса B+",
    category: "Офисы",
    area: 185,
    price: 85000,
    priceType: "month",
    address: "ул. Ленина, 24, этаж 7",
    description:
      "Открытая планировка с переговорной комнатой. Отдельный вход с этажа, парковочные места в подземном паркинге. Свежий ремонт, вся инфраструктура БЦ.",
    photos: [
      "https://cdn.poehali.dev/projects/14ab8a9c-f7f7-4f5b-acc4-7ade119a8a4c/files/e26283e0-ffc0-4a27-9427-c92236c173d3.jpg",
    ],
    floor: "7 из 14",
    features: ["Парковка", "Охрана 24/7", "Кондиционирование", "Оптика"],
  },
  {
    id: 2,
    title: "Отапливаемый склад с рампой",
    category: "Склады",
    area: 620,
    price: 180000,
    priceType: "month",
    address: "пр. Промышленный, 8",
    description:
      "Высота потолков 8м, ворота 4×4м, рампа для фур. Ж/д ветка в 300м. Офисный блок 40 кв.м. в составе. Возможна аренда от 200 кв.м.",
    photos: [
      "https://cdn.poehali.dev/projects/14ab8a9c-f7f7-4f5b-acc4-7ade119a8a4c/files/df668269-89ca-4d02-ae47-ba82350bace8.jpg",
    ],
    floor: "1 этаж",
    features: ["Отопление", "Рампа", "Видеонаблюдение", "Пожарная сигнализация"],
  },
  {
    id: 3,
    title: "Торговое помещение в ТЦ, 1 линия",
    category: "Под магазин",
    area: 95,
    price: 120000,
    priceType: "month",
    address: "ул. Торговая, 12, ТЦ «Меридиан»",
    description:
      "Стрит-ретейл, витринное остекление на оживлённый проспект. Пешеходный трафик 8000+ чел/день. Отдельный вход, своя терраса.",
    photos: [
      "https://cdn.poehali.dev/projects/14ab8a9c-f7f7-4f5b-acc4-7ade119a8a4c/files/e3bbc6b7-b7d5-4dee-9e90-67ff93534e08.jpg",
    ],
    floor: "1 этаж",
    features: ["Витрина", "Отдельный вход", "Высокий трафик"],
  },
];

const DEFAULT_CATEGORIES = ["Офисы", "Склады", "Под магазин", "Свободная планировка"];

function formatPrice(price: number, type: "month" | "sale") {
  const s = new Intl.NumberFormat("ru-RU").format(price);
  return type === "month" ? `${s} ₽/мес` : `${s} ₽`;
}

/* ─── ListingCard ─── */
function ListingCard({ listing, onClick }: { listing: Listing; onClick: () => void }) {
  return (
    <div
      className="bg-white border border-border card-hover cursor-pointer animate-slide-up flex flex-col overflow-hidden"
      onClick={onClick}
    >
      <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: "16/10" }}>
        {listing.photos[0] ? (
          <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Icon name="Building2" size={48} />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-navy text-white text-xs font-display uppercase tracking-wider px-3 py-1">
          {listing.category}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-display text-lg uppercase text-foreground leading-tight">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Icon name="MapPin" size={14} />
          <span>{listing.address}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{listing.description}</p>
        <div className="flex items-end justify-between pt-2 border-t border-border mt-auto">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Maximize2" size={13} />
              {listing.area} м²
            </span>
            {listing.floor && (
              <span className="flex items-center gap-1">
                <Icon name="Layers" size={13} />
                {listing.floor}
              </span>
            )}
          </div>
          <span className="font-display text-lg text-gold font-semibold">
            {formatPrice(listing.price, listing.priceType)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Listing Detail Modal ─── */
function ListingModal({ listing, onClose, phone }: { listing: Listing; onClose: () => void; phone: string }) {
  const [imgIndex, setImgIndex] = useState(0);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-muted overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {listing.photos.length > 0 ? (
            <img src={listing.photos[imgIndex]} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Icon name="Building2" size={64} />
            </div>
          )}
          {listing.photos.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {listing.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? "bg-gold" : "bg-white/60"}`}
                />
              ))}
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-foreground w-8 h-8 flex items-center justify-center shadow-md transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
          <span className="absolute top-3 left-3 bg-navy text-white text-xs font-display uppercase tracking-wider px-3 py-1">
            {listing.category}
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-5">
          <div>
            <h2 className="font-display text-2xl uppercase text-foreground leading-tight mb-2">{listing.title}</h2>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Icon name="MapPin" size={14} />
              <span>{listing.address}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary p-3 text-center">
              <div className="font-display text-xl text-foreground">{listing.area}</div>
              <div className="text-xs text-muted-foreground mt-0.5">кв. м</div>
            </div>
            {listing.floor && (
              <div className="bg-secondary p-3 text-center">
                <div className="font-display text-base text-foreground">{listing.floor}</div>
                <div className="text-xs text-muted-foreground mt-0.5">этаж</div>
              </div>
            )}
            <div className="bg-gold-light p-3 text-center">
              <div className="font-display text-base text-gold">{formatPrice(listing.price, listing.priceType)}</div>
              <div className="text-xs text-muted-foreground mt-0.5">стоимость</div>
            </div>
          </div>

          <div>
            <span className="section-divider" />
            <p className="text-sm leading-relaxed text-foreground mt-6">{listing.description}</p>
          </div>

          {listing.features && listing.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {listing.features.map((f) => (
                <span key={f} className="bg-secondary text-foreground text-xs font-body px-3 py-1.5 border border-border">
                  {f}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`tel:${phone}`}
              className="flex-1 bg-navy hover:bg-navy/90 text-white font-display uppercase tracking-wider text-sm px-6 py-3.5 flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="Phone" size={16} />
              Позвонить
            </a>
            <a
              href={`https://wa.me/${phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border-2 border-navy text-navy hover:bg-navy hover:text-white font-display uppercase tracking-wider text-sm px-6 py-3.5 flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="MessageCircle" size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Listing Modal ─── */
function AddListingModal({ onClose, onAdd, categories }: { onClose: () => void; onAdd: (l: Listing) => void; categories: string[] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "", category: categories[0] || "", customCategory: "",
    area: "", price: "", priceType: "month" as "month" | "sale",
    address: "", description: "", floor: "", features: "",
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [useCustom, setUseCustom] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const category = useCustom ? form.customCategory : form.category;
    onAdd({
      id: Date.now(), title: form.title, category,
      area: Number(form.area), price: Number(form.price), priceType: form.priceType,
      address: form.address, description: form.description, photos,
      floor: form.floor || undefined,
      features: form.features ? form.features.split(",").map((s) => s.trim()).filter(Boolean) : [],
    });
    onClose();
  }

  const inputCls = "w-full border border-border bg-white px-4 py-2.5 text-sm font-body text-foreground placeholder-muted-foreground focus:outline-none focus:border-navy transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="bg-navy text-white px-6 py-5 flex items-center justify-between">
          <h2 className="font-display text-xl uppercase tracking-wider">Новое объявление</h2>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5">Заголовок *</label>
            <input required className={inputCls} placeholder="Например: Офисный блок 200 кв.м" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5">Раздел *</label>
            <div className="flex gap-2 mb-2">
              <button type="button" onClick={() => setUseCustom(false)} className={`text-xs font-display uppercase tracking-wider px-3 py-1.5 border transition-colors ${!useCustom ? "bg-navy text-white border-navy" : "bg-white text-foreground border-border hover:border-navy"}`}>
                Из списка
              </button>
              <button type="button" onClick={() => setUseCustom(true)} className={`text-xs font-display uppercase tracking-wider px-3 py-1.5 border transition-colors ${useCustom ? "bg-navy text-white border-navy" : "bg-white text-foreground border-border hover:border-navy"}`}>
                + Новый раздел
              </button>
            </div>
            {useCustom ? (
              <input required className={inputCls} placeholder="Название нового раздела" value={form.customCategory} onChange={(e) => setForm({ ...form, customCategory: e.target.value })} />
            ) : (
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5">Площадь, м² *</label>
              <input required type="number" min="1" className={inputCls} placeholder="185" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5">Этаж</label>
              <input className={inputCls} placeholder="3 из 9" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5">Цена *</label>
            <div className="flex gap-2">
              <input required type="number" min="0" className={`${inputCls} flex-1`} placeholder="85000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <select className="border border-border bg-white px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:border-navy transition-colors" value={form.priceType} onChange={(e) => setForm({ ...form, priceType: e.target.value as "month" | "sale" })}>
                <option value="month">₽/мес</option>
                <option value="sale">₽ продажа</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5">Адрес *</label>
            <input required className={inputCls} placeholder="ул. Ленина, 24" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5">Описание *</label>
            <textarea required rows={3} className={`${inputCls} resize-none`} placeholder="Подробно опишите помещение, условия аренды..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5">Особенности (через запятую)</label>
            <input className={inputCls} placeholder="Парковка, Охрана, Кондиционирование" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5">Фотографии</label>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-border hover:border-navy text-muted-foreground hover:text-navy text-sm font-body py-4 flex flex-col items-center gap-2 transition-colors">
              <Icon name="ImagePlus" size={24} />
              Загрузить фото
            </button>
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {photos.map((src, i) => (
                  <div key={i} className="relative w-20 h-16 overflow-hidden">
                    <img src={src} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 bg-black/60 text-white w-5 h-5 flex items-center justify-center text-xs">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-gold hover:bg-gold/90 text-white font-display uppercase tracking-wider text-sm px-6 py-3.5 flex items-center justify-center gap-2 transition-colors mt-2">
            <Icon name="Plus" size={16} />
            Опубликовать объявление
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
const Index = () => {
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const agentName = "Иван Петров";
  const phone = "+7 (999) 123-45-67";

  const allCategories = [
    "Все",
    ...Array.from(new Set([...DEFAULT_CATEGORIES, ...listings.map((l) => l.category)])),
  ];

  const filtered = activeCategory === "Все" ? listings : listings.filter((l) => l.category === activeCategory);

  function handleAdd(l: Listing) {
    setListings((prev) => [l, ...prev]);
  }

  const listingsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="bg-navy text-white sticky top-0 z-40 shadow-md">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-gold flex items-center justify-center flex-shrink-0">
                <Icon name="Building2" size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-base md:text-lg uppercase tracking-wider leading-tight truncate">{agentName}</div>
                <div className="text-xs text-white/60 hidden sm:block">Коммерческая недвижимость</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-display uppercase tracking-wider">
              <button onClick={() => listingsRef.current?.scrollIntoView({ behavior: "smooth" })} className="text-white/80 hover:text-white transition-colors">Объявления</button>
              <button onClick={() => document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" })} className="text-white/80 hover:text-white transition-colors">Контакты</button>
            </nav>

            <div className="flex items-center gap-2">
              <a href={`tel:${phone}`} className="md:hidden bg-gold hover:bg-gold/90 text-white w-9 h-9 flex items-center justify-center transition-colors flex-shrink-0">
                <Icon name="Phone" size={16} />
              </a>
              <a href={`tel:${phone}`} className="hidden md:flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-body">
                <Icon name="Phone" size={14} />
                {phone}
              </a>
              <button onClick={() => setShowAddModal(true)} className="bg-gold hover:bg-gold/90 text-white font-display uppercase tracking-wider text-xs px-4 py-2 flex items-center gap-1.5 transition-colors">
                <Icon name="Plus" size={14} />
                <span className="hidden sm:inline">Добавить</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-navy text-white pt-16 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.08) 40px, rgba(255,255,255,0.08) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.08) 40px, rgba(255,255,255,0.08) 41px)",
          }}
        />
        <div className="container max-w-6xl mx-auto px-4 relative">
          <div className="max-w-2xl animate-slide-up">
            <div className="flex items-center gap-2 text-gold text-xs font-display uppercase tracking-widest mb-6">
              <span className="w-8 h-px bg-gold inline-block" />
              Коммерческая недвижимость
            </div>
            <h1 className="font-display text-4xl md:text-5xl uppercase leading-tight mb-6">
              Аренда и продажа<br />
              <span className="text-gold">деловых площадей</span>
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg">
              Офисы, склады, торговые помещения и свободная планировка — выбирайте объекты, соответствующие задачам вашего бизнеса.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => listingsRef.current?.scrollIntoView({ behavior: "smooth" })} className="bg-gold hover:bg-gold/90 text-white font-display uppercase tracking-wider text-sm px-7 py-3.5 transition-colors">
                Смотреть объявления
              </button>
              <a href={`tel:${phone}`} className="border border-white/30 hover:border-white text-white font-display uppercase tracking-wider text-sm px-7 py-3.5 flex items-center gap-2 transition-colors">
                <Icon name="Phone" size={15} />
                Позвонить
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-white border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 divide-x divide-border py-5">
            <div className="text-center px-4">
              <div className="font-display text-2xl text-navy">{listings.length}</div>
              <div className="text-xs text-muted-foreground mt-0.5">объявлений</div>
            </div>
            <div className="text-center px-4">
              <div className="font-display text-2xl text-navy">{allCategories.length - 1}</div>
              <div className="text-xs text-muted-foreground mt-0.5">категорий</div>
            </div>
            <div className="text-center px-4">
              <div className="font-display text-2xl text-navy">10+</div>
              <div className="text-xs text-muted-foreground mt-0.5">лет опыта</div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <section ref={listingsRef} className="py-14">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <span className="section-divider" />
            <h2 className="font-display text-3xl uppercase text-foreground mt-6 mb-2">Актуальные объявления</h2>
            <p className="text-muted-foreground text-sm">
              {filtered.length} объект{filtered.length !== 1 ? "ов" : ""} · «{activeCategory}»
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-display uppercase tracking-wider text-xs px-4 py-2 border transition-colors whitespace-nowrap ${activeCategory === cat ? "bg-navy text-white border-navy" : "bg-white text-foreground border-border hover:border-navy"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Icon name="Building2" size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-display uppercase tracking-wider">В этом разделе пока нет объявлений</p>
              <button onClick={() => setShowAddModal(true)} className="mt-4 bg-navy hover:bg-navy/90 text-white font-display uppercase tracking-wider text-xs px-5 py-2.5 inline-flex items-center gap-2 transition-colors">
                <Icon name="Plus" size={14} />
                Добавить первое
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((l) => (
                <ListingCard key={l.id} listing={l} onClick={() => setSelectedListing(l)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="bg-navy text-white py-14">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs font-display uppercase tracking-widest mb-5">
                <span className="w-8 h-px bg-gold inline-block" />
                Связь с риелтором
              </div>
              <h2 className="font-display text-3xl uppercase mb-4">Обсудим ваш запрос</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-8">
                Позвоните напрямую или оставьте заявку — подберу объект под задачи вашего бизнеса, площадь, бюджет и локацию.
              </p>
              <a href={`tel:${phone}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-gold/20 group-hover:bg-gold flex items-center justify-center transition-colors flex-shrink-0">
                  <Icon name="Phone" size={18} className="text-gold group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="text-xs text-white/50 font-display uppercase tracking-wider">Телефон</div>
                  <div className="font-body text-white text-base">{phone}</div>
                </div>
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 md:p-8">
              <h3 className="font-display text-xl uppercase text-white mb-5">Быстрый запрос</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Спасибо! Свяжемся с вами в ближайшее время."); (e.target as HTMLFormElement).reset(); }}>
                <input required className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm font-body focus:outline-none focus:border-gold transition-colors" placeholder="Ваше имя" />
                <input required type="tel" className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm font-body focus:outline-none focus:border-gold transition-colors" placeholder="Телефон" />
                <textarea rows={3} className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Что ищете? Площадь, бюджет, район..." />
                <button type="submit" className="w-full bg-gold hover:bg-gold/90 text-white font-display uppercase tracking-wider text-sm px-6 py-3.5 transition-colors">
                  Отправить запрос
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white/50 py-6">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-body">
          <span className="font-display uppercase tracking-wider text-white/70">{agentName}</span>
          <span>Коммерческая недвижимость · {new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* Modals */}
      {selectedListing && (
        <ListingModal listing={selectedListing} onClose={() => setSelectedListing(null)} phone={phone} />
      )}
      {showAddModal && (
        <AddListingModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} categories={allCategories.filter((c) => c !== "Все")} />
      )}

      {/* Mobile FAB */}
      <a
        href={`tel:${phone}`}
        className="fixed bottom-5 right-5 z-30 md:hidden bg-gold hover:bg-gold/90 text-white w-14 h-14 flex items-center justify-center shadow-lg transition-colors rounded-full"
      >
        <Icon name="Phone" size={22} />
      </a>
    </div>
  );
};

export default Index;
