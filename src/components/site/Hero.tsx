import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { ArrowRight } from "lucide-react";

// Reduced from 2000 → 300, no per-frame position mutation
function Particles({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#E8C98A" transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Reduced segments: 320,48 → 100,24
function GoldKnot() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.15;
      ref.current.rotation.y += dt * 0.2;
    }
  });
  return (
    <mesh ref={ref} scale={1.1}>
      <torusKnotGeometry args={[1.2, 0.36, 100, 24]} />
      <meshStandardMaterial color="#C9A96E" metalness={0.9} roughness={0.2} emissive="#3a2a08" emissiveIntensity={0.3} />
    </mesh>
  );
}

function SceneParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ pointer }) => {
    if (!ref.current) return;
    ref.current.rotation.y += (pointer.x * 0.3 - ref.current.rotation.y) * 0.04;
    ref.current.rotation.x += (-pointer.y * 0.2 - ref.current.rotation.x) * 0.04;
  });
  return <group ref={ref}>{children}</group>;
}

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden grain">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,color-mix(in_oklab,var(--gold)_22%,transparent),transparent_60%)]" />
      <div className="absolute inset-0 -z-10">
        {/* dpr capped at 1, no postprocessing bloom, no Text3D (font fetch) */}
        <Canvas dpr={1} camera={{ position: [0, 0, 5.5], fov: 50 }} gl={{ antialias: false, alpha: true }} performance={{ min: 0.5 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fff5dd" />
            <directionalLight position={[-3, -2, -2]} intensity={0.5} color="#C9A96E" />
            <SceneParallax>
              <GoldKnot />
              <Float speed={1} floatIntensity={0.4}>
                <Particles />
              </Float>
            </SceneParallax>
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/40 via-ink/10 to-ink" />

      <div className="relative mx-auto max-w-7xl px-6 pt-44 md:pt-52 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-3 glass rounded-full px-4 py-1.5 mb-8">
            <span className="size-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-cream/80">
              FW26 · Atelier Drop
            </span>
          </div>

          <h1 className="font-display text-[14vw] md:text-[8.5vw] lg:text-[7.5rem] leading-[0.95] text-cream">
            Redefine <br />
            Your <span className="italic text-gradient-gold">Fabric</span>
          </h1>

          <p className="mt-8 max-w-xl text-base md:text-lg text-cream/70 leading-relaxed">
            A house of heritage textiles, woven for those who dress with intention.
            Sculpted silhouettes. Materials with memory.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#collections"
              className="group inline-flex items-center gap-3 glass-strong shadow-gold rounded-full pl-6 pr-2 py-2 text-sm tracking-[0.14em] uppercase text-cream hover:text-ink hover:bg-gold transition-all duration-500"
            >
              Explore Collection
              <span className="grid place-items-center size-9 rounded-full bg-gold text-ink transition-transform group-hover:rotate-45">
                <ArrowRight className="size-4" />
              </span>
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 text-sm tracking-[0.14em] uppercase text-cream/90 hover:bg-white/10 transition"
            >
              The Atelier
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-6 right-6 mx-auto max-w-7xl flex items-end justify-between text-cream/60 text-xs tracking-[0.2em] uppercase"
        >
          <div className="hidden md:block">Scroll · Discover</div>
          <div className="flex gap-8">
            <div><span className="text-gold">01</span> · Heritage</div>
            <div><span className="text-gold">02</span> · Craft</div>
            <div><span className="text-gold">03</span> · Future</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
