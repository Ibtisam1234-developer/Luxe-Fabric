import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { collections } from "@/lib/products";
import { Plus } from "lucide-react";

function TiltCard({ c, i }: { c: typeof collections[number]; i: number }) {
  const mx = useMotionValue(0); // -0.5..0.5
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14]);

  // layer parallax
  const bgX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const bgY = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const midX = useTransform(sx, [-0.5, 0.5], [-32, 32]);
  const midY = useTransform(sy, [-0.5, 0.5], [-22, 22]);
  const txX = useTransform(sx, [-0.5, 0.5], [-48, 48]);
  const txY = useTransform(sy, [-0.5, 0.5], [-30, 30]);

  // glow position (mouse % within card)
  const glowX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }}
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-card shadow-luxe will-change-transform"
    >
      {/* 3D border glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [glowX, glowY] as never,
            ([x, y]: string[]) =>
              `radial-gradient(380px circle at ${x} ${y}, rgba(201,169,110,0.55), transparent 60%)`,
          ),
          mixBlendMode: "screen",
        }}
      />

      {/* Background image layer */}
      <motion.img
        src={c.image}
        alt={`${c.name} collection`}
        loading="lazy"
        style={{ x: bgX, y: bgY, translateZ: 0 }}
        className="absolute -inset-6 size-[calc(100%+3rem)] object-cover scale-110 transition-transform duration-700 group-hover:scale-125"
      />

      {/* Middle gradient layer */}
      <motion.div
        style={{ x: midX, y: midY, translateZ: 30 }}
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"
      />

      {/* Tag */}
      <motion.div
        style={{ x: txX, y: txY, translateZ: 60 }}
        className="absolute top-5 left-5 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream"
      >
        {c.tag}
      </motion.div>

      {/* Text layer */}
      <motion.div
        style={{ x: txX, y: txY, translateZ: 80 }}
        className="absolute inset-x-0 bottom-0 p-6"
      >
        <h3 className="font-display text-2xl md:text-3xl text-cream drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">{c.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-cream/70">From ${c.price}</span>
          <button className="inline-flex items-center gap-2 glass-strong rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-cream hover:bg-gold hover:text-ink transition">
            <Plus className="size-3" /> Add
          </button>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function Collections() {
  return (
    <section id="collections" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">— 01 / Collections</div>
            <h2 className="font-display text-5xl md:text-7xl text-cream leading-[0.95]">
              Curated <span className="italic text-gradient-gold">capsules</span>,<br />season after season.
            </h2>
          </div>
          <a href="#shop" className="text-sm uppercase tracking-[0.18em] text-cream/70 hover:text-gold transition">
            View Lookbook →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: 1400 }}>
          {collections.map((c, i) => (
            <TiltCard key={c.name} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
