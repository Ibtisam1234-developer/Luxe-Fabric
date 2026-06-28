import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Instagram, Twitter, Youtube, Facebook } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="relative border-t border-white/5">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_80%_50%,color-mix(in_oklab,var(--gold)_25%,transparent),transparent_70%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_10%_50%,color-mix(in_oklab,var(--gold)_12%,transparent),transparent_70%)]" />

        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">— Letters</div>
            <h2 className="font-display text-5xl md:text-6xl text-cream leading-[0.95]">
              Slow notes from <br />the <span className="italic text-gradient-gold">atelier</span>.
            </h2>
            <p className="mt-5 text-cream/70 max-w-md">
              First access to new fabrics, drops, and the stories behind every seam.
            </p>
          </motion.div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSent(true);
            }}
            className="glass-strong shadow-luxe rounded-full p-2 flex items-center"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-5 py-3 text-cream placeholder:text-cream/40 outline-none text-sm tracking-wide"
            />
            <button
              type="submit"
              className="group inline-flex items-center gap-2 rounded-full bg-gold text-ink px-5 py-3 text-[11px] uppercase tracking-[0.18em] hover:bg-cream transition"
            >
              {sent ? "Welcome" : "Subscribe"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-2xl tracking-[0.18em] text-cream">
              MAISON<span className="text-gold">·</span>LUXE
            </div>
            <p className="mt-4 text-sm text-cream/60 max-w-xs">
              Atelier of heritage textiles. Crafted in Como, dressed worldwide.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid place-items-center size-10 rounded-full glass hover:bg-gold hover:text-ink text-cream transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Collections" items={["Summer Luxe", "Urban Edge", "Heritage Craft", "Avant-Garde", "Archive"]} />
          <FooterCol title="Info" items={["About", "Sustainability", "Stockists", "Care Guide", "Press"]} />
          <FooterCol title="Service" items={["Contact", "Shipping", "Returns", "Bespoke", "FAQ"]} />
        </div>
        <div className="border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-cream/40">
            <span>© {new Date().getFullYear()} Maison Luxe Atelier. All rights reserved.</span>
            <span>Crafted slowly · Made to last</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-gold mb-5">{title}</div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it}>
            <a href="#" className="text-sm text-cream/70 hover:text-cream transition-colors">
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
