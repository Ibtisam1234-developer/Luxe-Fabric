import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

type Mat = {
  name: string; color: string; sheen: string;
  roughness: number; metalness: number;
  weight: string; texture: string; origin: string;
};

const materials: Mat[] = [
  { name: "Silk",     color: "#E8C9A0", sheen: "#fff3d4", roughness: 0.2,  metalness: 0.55, weight: "85 gsm",  texture: "Lustrous, fluid",  origin: "Como, Italy" },
  { name: "Cotton",   color: "#F2EADD", sheen: "#ffffff", roughness: 0.85, metalness: 0.05, weight: "180 gsm", texture: "Soft, breathable", origin: "Cairo, Egypt" },
  { name: "Linen",    color: "#D9C7AE", sheen: "#f6e9c8", roughness: 0.95, metalness: 0.0,  weight: "210 gsm", texture: "Crisp, textural",  origin: "Flanders" },
  { name: "Wool",     color: "#7B6A52", sheen: "#caa66e", roughness: 0.75, metalness: 0.1,  weight: "320 gsm", texture: "Dense, warm",      origin: "Yorkshire, UK" },
  { name: "Cashmere", color: "#C9A96E", sheen: "#fff0c8", roughness: 0.55, metalness: 0.25, weight: "260 gsm", texture: "Whisper-soft",     origin: "Inner Mongolia" },
];

// Orbiting light — kept, cheap
function OrbitingLight() {
  const ref = useRef<THREE.PointLight>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = Math.cos(t * 0.8) * 3;
      ref.current.position.z = Math.sin(t * 0.8) * 3;
      ref.current.position.y = Math.sin(t * 0.5) * 1.5;
    }
  });
  return <pointLight ref={ref} intensity={2} color="#fff3d4" distance={8} />;
}

// Segments reduced 260,36 → 80,16
function FabricBall({ mat }: { mat: Mat }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.4;
      ref.current.rotation.x += dt * 0.15;
    }
  });
  return (
    <mesh ref={ref} scale={1.4} position={[0, 0.2, 0]}>
      <torusKnotGeometry args={[1, 0.34, 80, 16]} />
      <meshStandardMaterial color={mat.color} roughness={mat.roughness} metalness={mat.metalness} />
    </mesh>
  );
}

export function Materials() {
  const [idx, setIdx] = useState(0);
  const mat = materials[idx];

  return (
    <section id="materials" className="relative py-28 md:py-36 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14">
          <div className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">— 03 / Materials</div>
          <h2 className="font-display text-5xl md:text-7xl text-cream leading-[0.95]">
            Choose your <span className="italic text-gradient-gold">matter</span>.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="relative aspect-square rounded-3xl glass-strong shadow-luxe overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#1c1814,#0a0a0a_70%)]">
            {/* dpr=1, no ContactShadows, no city env (expensive) → studio */}
            <Canvas dpr={1} camera={{ position: [0, 0.5, 5], fov: 45 }} gl={{ antialias: false, alpha: true }} performance={{ min: 0.5 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[3, 4, 4]} intensity={1.2} color="#fff3d4" />
                <OrbitingLight />
                <FabricBall mat={mat} />
                <Environment preset="studio" />
              </Suspense>
            </Canvas>
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
              {materials.map((m, i) => (
                <button
                  key={m.name}
                  onClick={() => setIdx(i)}
                  className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                    i === idx ? "bg-gold text-ink" : "glass text-cream/80 hover:text-cream"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={mat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-[11px] uppercase tracking-[0.25em] text-gold mb-3">Material 0{idx + 1}</div>
                <h3 className="font-display text-6xl text-cream">{mat.name}</h3>
                <p className="mt-4 text-cream/70 max-w-md">
                  {mat.texture}. Woven for garments that last beyond seasons,
                  with the integrity to be inherited.
                </p>
                <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { k: "Weight", v: mat.weight },
                    { k: "Hand", v: mat.texture },
                    { k: "Origin", v: mat.origin },
                  ].map((r) => (
                    <div key={r.k} className="glass rounded-2xl p-5">
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/50">{r.k}</dt>
                      <dd className="mt-2 text-cream font-display text-lg">{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
