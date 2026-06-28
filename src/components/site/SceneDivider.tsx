import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function Shape({ pos, kind, color, scale = 1 }: { pos: [number, number, number]; kind: "ico" | "oct" | "box"; color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.2;
    ref.current.rotation.y += dt * 0.3;
  });
  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={1}>
      <mesh ref={ref} position={pos} scale={scale}>
        {kind === "ico" && <icosahedronGeometry args={[0.5, 0]} />}
        {kind === "oct" && <octahedronGeometry args={[0.5, 0]} />}
        {kind === "box" && <boxGeometry args={[0.6, 0.6, 0.6]} />}
        <meshPhysicalMaterial color={color} metalness={0.7} roughness={0.3} transparent opacity={0.55} sheen={1} sheenColor="#fff3d4" />
      </mesh>
    </Float>
  );
}

export function SceneDivider() {
  return (
    <div className="pointer-events-none relative h-32 md:h-44 w-full overflow-hidden opacity-80" style={{ filter: "blur(0.3px)" }}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 3, 4]} intensity={1} color="#fff3d4" />
          <Shape pos={[-4, 0.3, 0]} kind="ico" color="#C9A96E" />
          <Shape pos={[-1.5, -0.4, 1]} kind="oct" color="#F5F0E8" scale={0.7} />
          <Shape pos={[1.2, 0.5, 0]} kind="box" color="#C9A96E" scale={0.8} />
          <Shape pos={[3.6, -0.3, 0.5]} kind="ico" color="#E8C98A" scale={1.1} />
          <Shape pos={[5, 0.4, -1]} kind="oct" color="#F5F0E8" />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
    </div>
  );
}
