import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { motion, useInView, animate } from "framer-motion";
import * as THREE from "three";

function FabricSphere() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.3;
  });
  return (
    <mesh ref={ref}>
      {/* reduced from 48,48 → 32,32 */}
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial color="#C9A96E" metalness={0.6} roughness={0.3} wireframe />
    </mesh>
  );
}

// 3 rings instead of 4, segments reduced 160 → 48
function Ring({ axis, speed, radius, tilt, color }: {
  axis: "x" | "y" | "z"; speed: number; radius: number; tilt: [number, number, number]; color: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation[axis] += dt * speed; });
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.018, 8, 48]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} emissive={color} emissiveIntensity={0.15} />
    </mesh>
  );
}

function Armillary() {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ pointer }) => {
    if (!group.current) return;
    group.current.rotation.y += (pointer.x * 0.5 - group.current.rotation.y) * 0.03;
    group.current.rotation.x += (-pointer.y * 0.3 - group.current.rotation.x) * 0.03;
  });
  return (
    <group ref={group}>
      <FabricSphere />
      <Ring axis="y" speed={0.6} radius={1.7} tilt={[0.3, 0, 0]} color="#E8C98A" />
      <Ring axis="x" speed={0.4} radius={1.95} tilt={[0, 0.7, 0.5]} color="#C9A96E" />
      <Ring axis="z" speed={0.8} radius={2.2} tilt={[1.1, 0.3, 0]} color="#F5F0E8" />
    </group>
  );
}

function Counter({ to, suffix }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const ctrl = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => (node.textContent = Math.round(v).toString() + (suffix ?? "")),
    });
    return () => ctrl.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export function Story() {
  return (
    <section id="story" className="relative py-28 md:py-36 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-square rounded-3xl glass shadow-luxe overflow-hidden">
          <Canvas dpr={1} camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: false, alpha: true }} performance={{ min: 0.5 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 5, 3]} intensity={1.2} color="#fff3d4" />
              <Armillary />
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
          <div className="absolute bottom-4 left-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream/80">
            Armillary · 3D
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">— 02 / The House</div>
          <h2 className="font-display text-5xl md:text-6xl text-cream leading-[0.95]">
            Five decades of <span className="italic text-gradient-gold">slow craft</span>.
          </h2>
          <p className="mt-6 text-cream/70 leading-relaxed max-w-lg">
            From a single loom in Como to ateliers across three continents, Maison Luxe
            crafts textiles the way pieces of art are made — patiently, deliberately,
            with hands that know every thread.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { v: 50, s: "+", l: "Years of craft" },
              { v: 200, s: "+", l: "Signature fabrics" },
              { v: 30, s: "", l: "Countries served" },
            ].map((stat) => (
              <div key={stat.l} className="glass rounded-2xl p-5">
                <div className="font-display text-4xl md:text-5xl text-gradient-gold">
                  <Counter to={stat.v} suffix={stat.s} />
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-cream/60">{stat.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
