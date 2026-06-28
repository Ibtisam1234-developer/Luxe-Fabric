import { useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Isabelle Moreau", role: "Vogue Paris", rating: 5,
    quote: "An atelier that treats fabric like sculpture. Every seam tells a story.",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&w=200&h=200&facepad=3&q=80" },
  { name: "Kenji Tanaka", role: "Stylist, Tokyo", rating: 5,
    quote: "The cashmere is unmatched. I have not felt anything close in twenty years.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=200&h=200&facepad=3&q=80" },
  { name: "Amara Okafor", role: "Creative Director", rating: 5,
    quote: "Quiet luxury, loud craft. Maison Luxe is now my entire winter wardrobe.",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=facearea&w=200&h=200&facepad=3&q=80" },
  { name: "Lucas Bernhardt", role: "Architect, Berlin", rating: 5,
    quote: "Tailoring with restraint. The drape is closer to architecture than fashion.",
    photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=facearea&w=200&h=200&facepad=3&q=80" },
  { name: "Sofia Russo", role: "Editor, Milano", rating: 5,
    quote: "Heritage without nostalgia. They make tomorrow's classics, today.",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&w=200&h=200&facepad=3&q=80" },
];

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section id="testimonials" className="relative py-28 md:py-36 border-t border-white/5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">— 05 / Voices</div>
        <h2 className="font-display text-5xl md:text-7xl text-cream leading-[0.95]">
          Worn by the <span className="italic text-gradient-gold">discerning</span>.
        </h2>
      </div>

      {/* Pure CSS 3D carousel — zero JS per frame */}
      <style>{`
        @keyframes carousel-spin {
          from { transform: translateZ(-300px) rotateY(0deg); }
          to   { transform: translateZ(-300px) rotateY(360deg); }
        }
        .carousel-track {
          animation: carousel-spin 28s linear infinite;
          transform-style: preserve-3d;
        }
        .carousel-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="relative mx-auto mt-20 h-[440px] max-w-5xl"
        style={{ perspective: 1600 }}
      >
        <div
          ref={trackRef}
          className="carousel-track absolute inset-0"
        >
          {testimonials.map((t, i) => {
            const theta = (i / testimonials.length) * 360;
            return (
              <div
                key={t.name}
                className="absolute left-1/2 top-1/2 w-72 -mt-44 -ml-36 glass-strong shadow-luxe rounded-3xl p-7 cursor-default"
                style={{
                  transform: `rotateY(${theta}deg) translateZ(300px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="flex items-center gap-4">
                  <img src={t.photo} alt={`${t.name} portrait`} loading="lazy"
                    className="size-12 rounded-full object-cover border border-gold/50" />
                  <div className="text-left">
                    <div className="text-cream font-display text-base">{t.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-cream/50">{t.role}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="size-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mt-4 text-cream/80 text-sm leading-relaxed italic text-left">"{t.quote}"</p>
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
    </section>
  );
}
