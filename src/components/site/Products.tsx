import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/products";
import { Eye, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart";

const categories = ["All", "Women", "Men"] as const;
const fabrics = ["All", "Silk", "Cotton", "Linen", "Wool", "Cashmere"] as const;
const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "<$200", min: 0, max: 199 },
  { label: "$200–$350", min: 200, max: 350 },
  { label: "$350+", min: 350, max: Infinity },
];

const fabricMeta: Record<string, { weight: string; origin: string }> = {
  Silk: { weight: "85 gsm", origin: "Como, Italy" },
  Cotton: { weight: "180 gsm", origin: "Cairo, Egypt" },
  Linen: { weight: "210 gsm", origin: "Flanders" },
  Wool: { weight: "320 gsm", origin: "Yorkshire, UK" },
  Cashmere: { weight: "260 gsm", origin: "Inner Mongolia" },
};

export function Products() {
  const { add, items } = useCart();
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [fab, setFab] = useState<(typeof fabrics)[number]>("All");
  const [price, setPrice] = useState(priceRanges[0]);
  const [added, setAdded] = useState<string | null>(null);

  const filtered = useMemo(
    () => products.filter(p =>
      (cat === "All" || p.category === cat) &&
      (fab === "All" || p.fabric === fab) &&
      p.price >= price.min && p.price <= price.max
    ), [cat, fab, price]
  );

  function handleAdd(p: typeof products[0]) {
    add(p);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1800);
  }

  const inCart = (id: string) => items.some(i => i.id === id);

  return (
    <section id="shop" className="relative py-28 md:py-36 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">— 04 / Atelier Shop</div>
            <h2 className="font-display text-5xl md:text-7xl text-cream leading-[0.95]">
              The <span className="italic text-gradient-gold">wardrobe</span>.
            </h2>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-5 mb-10 flex flex-wrap gap-6">
          <FilterGroup label="Category" options={categories as readonly string[]} value={cat} onChange={v => setCat(v as typeof cat)} />
          <FilterGroup label="Fabric" options={fabrics as readonly string[]} value={fab} onChange={v => setFab(v as typeof fab)} />
          <FilterGroup label="Price" options={priceRanges.map(p => p.label)} value={price.label}
            onChange={v => setPrice(priceRanges.find(p => p.label === v) ?? priceRanges[0])} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const meta = fabricMeta[p.fabric];
              const isAdded = added === p.id;
              const isInCart = inCart(p.id);
              return (
                <motion.div layout key={p.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
                  className="group relative aspect-[3/4] [perspective:1600px]"
                >
                  <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front */}
                    <article className="absolute inset-0 rounded-2xl overflow-hidden bg-card shadow-luxe [backface-visibility:hidden]">
                      <div className="relative h-[78%] overflow-hidden">
                        <img src={p.image} alt={p.alt} loading="lazy"
                          className="absolute inset-0 size-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute top-4 right-4 grid place-items-center size-10 rounded-full glass text-cream">
                          <Eye className="size-4" />
                        </div>
                        {isInCart && (
                          <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-gold flex items-center gap-1.5">
                            <Check className="size-3" /> In Bag
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-lg text-cream leading-tight">{p.name}</h3>
                            <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-cream/50">{p.fabric} · {p.color}</div>
                          </div>
                          <div className="text-gold font-display text-lg">${p.price}</div>
                        </div>
                      </div>
                    </article>

                    {/* Back */}
                    <article
                      className="absolute inset-0 rounded-2xl overflow-hidden shadow-luxe [backface-visibility:hidden] [transform:rotateY(180deg)] p-6 flex flex-col justify-between text-cream"
                      style={{
                        background: "linear-gradient(135deg,#1a1410 0%,#2a1f15 100%),repeating-linear-gradient(45deg,rgba(201,169,110,.15) 0 2px,transparent 2px 14px)",
                        backgroundBlendMode: "overlay",
                      }}
                    >
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-3">Atelier Detail</div>
                        <h3 className="font-display text-2xl leading-tight">{p.name}</h3>
                        <dl className="mt-6 space-y-3 text-sm">
                          {[
                            { k: "Fabric", v: p.fabric },
                            { k: "Weight", v: meta?.weight ?? "—" },
                            { k: "Origin", v: meta?.origin ?? "—" },
                            { k: "Colour", v: p.color },
                          ].map(r => (
                            <div key={r.k} className="flex justify-between border-b border-gold/15 pb-2">
                              <dt className="text-cream/60 uppercase text-[10px] tracking-[0.18em]">{r.k}</dt>
                              <dd>{r.v}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleAdd(p); }}
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-[11px] uppercase tracking-[0.2em] font-medium transition ${
                          isAdded ? "bg-green-500/80 text-white" : "bg-gold text-ink hover:bg-cream"
                        }`}
                      >
                        {isAdded
                          ? <><Check className="size-4" /> Added!</>
                          : <><ShoppingBag className="size-4" /> Add to Bag · ${p.price}</>
                        }
                      </button>
                    </article>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ label, options, value, onChange }: {
  label: string; options: readonly string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[10px] uppercase tracking-[0.22em] text-cream/50">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)}
            className={`rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] transition ${
              o === value ? "bg-gold text-ink" : "bg-white/5 text-cream/70 hover:text-cream"
            }`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
