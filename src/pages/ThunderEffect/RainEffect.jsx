import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from 'leva';

const RainEffect = () => {
  const rainRef = useRef();

  // Rain controls
  const controls = useControls('Rain', {
    count: { value: 800, min: 100, max: 3000, step: 100, label: 'Rain Drops' },
    spread: { value: 50, min: 10, max: 100, step: 5, label: 'Spread Area' },
    height: { value: 30, min: 10, max: 50, step: 1, label: 'Start Height' },
    speed: { value: 0.8, min: 0.1, max: 3, step: 0.1, label: 'Fall Speed' },
    length: { value: 0.8, min: 0.2, max: 3, step: 0.1, label: 'Streak Length' },
    opacity: { value: 0.4, min: 0, max: 1, step: 0.05, label: 'Opacity' },
    color: { value: '#b0c4de', label: 'Rain Color' },
    enabled: { value: true, label: 'Enable Rain' },
  });

  // Generate rain line segments (each drop is a line with 2 vertices)
  const rainParticles = useMemo(() => {
    const positions = new Float32Array(controls.count * 6); // 2 vertices per line * 3 coords
    const velocities = new Float32Array(controls.count);

    for (let i = 0; i < controls.count; i++) {
      const i6 = i * 6;

      // Random position in a spread area
      const x = (Math.random() - 0.5) * controls.spread;
      const y = Math.random() * controls.height;
      const z = (Math.random() - 0.5) * controls.spread;

      // First vertex (top of raindrop)
      positions[i6] = x;
      positions[i6 + 1] = y;
      positions[i6 + 2] = z;

      // Second vertex (bottom of raindrop - creates the streak)
      positions[i6 + 3] = x;
      positions[i6 + 4] = y - controls.length;
      positions[i6 + 5] = z;

      // Random velocity for each particle
      velocities[i] = controls.speed * (0.8 + Math.random() * 0.4);
    }

    return { positions, velocities };
  }, [controls.count, controls.spread, controls.height, controls.speed, controls.length]);

  // Animate rain falling
  useFrame(() => {
    if (!rainRef.current || !controls.enabled) return;

    const positions = rainRef.current.geometry.attributes.position.array;
    const velocities = rainParticles.velocities;

    for (let i = 0; i < controls.count; i++) {
      const i6 = i * 6;

      // Move both vertices down (the whole line)
      positions[i6 + 1] -= velocities[i]; // top vertex y
      positions[i6 + 4] -= velocities[i]; // bottom vertex y

      // Reset particle to top when it falls below ground
      if (positions[i6 + 4] < -5) {
        const x = (Math.random() - 0.5) * controls.spread;
        const y = controls.height;
        const z = (Math.random() - 0.5) * controls.spread;

        // Reset top vertex
        positions[i6] = x;
        positions[i6 + 1] = y;
        positions[i6 + 2] = z;

        // Reset bottom vertex
        positions[i6 + 3] = x;
        positions[i6 + 4] = y - controls.length;
        positions[i6 + 5] = z;
      }
    }

    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!controls.enabled) return null;

  return (
    <lineSegments ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={controls.count * 2}
          array={rainParticles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={controls.color}
        transparent
        opacity={controls.opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

export default RainEffect;
