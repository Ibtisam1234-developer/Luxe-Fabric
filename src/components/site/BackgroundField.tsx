import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ScrollParticles({ count = 3000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = -Math.random() * 60;
    }
    return arr;
  }, [count]);

  useFrame(({ camera, clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = t * 0.02;
    const scroll = typeof window !== "undefined"
      ? window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      : 0;
    camera.position.z = 5 - scroll * 25;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#C9A96E" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export function BackgroundField() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 55 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ScrollParticles />
        </Suspense>
      </Canvas>
    </div>
  );
}
