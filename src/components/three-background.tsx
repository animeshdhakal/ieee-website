"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Configuration
  const count = 2000;

  // Initialize arrays
  const { positions, colors, initialPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);

    // Vibrant multi-stop palette: electric blue -> cyan -> violet
    const palette = [
      new THREE.Color("#2563eb"), // electric blue
      new THREE.Color("#22d3ee"), // cyan
      new THREE.Color("#38bdf8"), // sky
      new THREE.Color("#818cf8"), // indigo
      new THREE.Color("#a855f7"), // violet accent
    ];

    for (let i = 0; i < count; i++) {
      // Create a spread that covers the screen but has depth
      const x = (Math.random() - 0.5) * 25; // Wide spread
      const y = (Math.random() - 0.5) * 15; // Vertical spread
      const z = (Math.random() - 0.5) * 10; // Depth

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;

      // Colors: interpolate across the palette for a rich gradient spread
      const t = Math.random() * (palette.length - 1);
      const idx = Math.floor(t);
      const mixedColor = palette[idx]
        .clone()
        .lerp(palette[Math.min(idx + 1, palette.length - 1)], t - idx);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    return { positions, colors, initialPositions };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;

    const { clock, pointer } = state;
    const time = clock.getElapsedTime() * 0.2; // Slow animation

    // pointer is normalized (-1 to +1)
    // Convert to world units at z=0 approx
    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;

    const currentPositions = ref.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ix = initialPositions[i3];
      const iy = initialPositions[i3 + 1];
      const iz = initialPositions[i3 + 2];

      // Wave animation: Sine wave drift
      // Offset based on position to create "wave" feel
      const dx = Math.sin(time + iy * 0.2) * 0.5;
      const dy = Math.cos(time + ix * 0.2) * 0.5;

      let x = ix + dx;
      let y = iy + dy;
      let z = iz;

      // Mouse interaction: Repulsion
      const distDx = x - mouseX;
      const distDy = y - mouseY;
      const distSq = distDx * distDx + distDy * distDy;

      // Interaction radius squared (avoid sqrt for perf, though negligible here)
      // Radius = 4 -> 16
      if (distSq < 16) {
        const dist = Math.sqrt(distSq);
        const force = (4 - dist) / 4;
        const angle = Math.atan2(distDy, distDx);

        const push = force * 2; // Strength

        x += Math.cos(angle) * push;
        y += Math.sin(angle) * push;
      }

      currentPositions[i3] = x;
      currentPositions[i3 + 1] = y;
      currentPositions[i3 + 2] = z;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;

    // Subtle overall rotation
    ref.current.rotation.y = time * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const ThreeBackground: React.FC<{ className?: string }> = ({ className }) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`absolute inset-0 z-0 h-full w-full bg-ieee-dark ${className}`}
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 z-0 h-full w-full pointer-events-auto ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]} // Optimize pixel ratio for performance
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
