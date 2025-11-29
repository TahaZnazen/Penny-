import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Static configuration (previously Leva controls)
const CONFIG = {
  count: 800,
  spread: 50,
  height: 30,
  speed: 0.8,
  length: 0.8,
  opacity: 0.4,
  color: '#b0c4de',
  enabled: true,
};

const RainEffect = () => {
  const rainRef = useRef();

  // Generate rain line segments (each drop is a line with 2 vertices)
  const rainParticles = useMemo(() => {
    const positions = new Float32Array(CONFIG.count * 6);
    const velocities = new Float32Array(CONFIG.count);

    for (let i = 0; i < CONFIG.count; i++) {
      const i6 = i * 6;

      const x = (Math.random() - 0.5) * CONFIG.spread;
      const y = Math.random() * CONFIG.height;
      const z = (Math.random() - 0.5) * CONFIG.spread;

      // First vertex (top of raindrop)
      positions[i6] = x;
      positions[i6 + 1] = y;
      positions[i6 + 2] = z;

      // Second vertex (bottom of raindrop)
      positions[i6 + 3] = x;
      positions[i6 + 4] = y - CONFIG.length;
      positions[i6 + 5] = z;

      velocities[i] = CONFIG.speed * (0.8 + Math.random() * 0.4);
    }

    return { positions, velocities };
  }, []);

  // Animate rain falling
  useFrame(() => {
    if (!rainRef.current || !CONFIG.enabled) return;

    const positions = rainRef.current.geometry.attributes.position.array;
    const velocities = rainParticles.velocities;

    for (let i = 0; i < CONFIG.count; i++) {
      const i6 = i * 6;

      positions[i6 + 1] -= velocities[i];
      positions[i6 + 4] -= velocities[i];

      if (positions[i6 + 4] < -5) {
        const x = (Math.random() - 0.5) * CONFIG.spread;
        const y = CONFIG.height;
        const z = (Math.random() - 0.5) * CONFIG.spread;

        positions[i6] = x;
        positions[i6 + 1] = y;
        positions[i6 + 2] = z;

        positions[i6 + 3] = x;
        positions[i6 + 4] = y - CONFIG.length;
        positions[i6 + 5] = z;
      }
    }

    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!CONFIG.enabled) return null;

  return (
    <lineSegments ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={CONFIG.count * 2}
          array={rainParticles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={CONFIG.color}
        transparent
        opacity={CONFIG.opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

export default RainEffect;
