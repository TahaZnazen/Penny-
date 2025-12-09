import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Static configuration - moved outside component to prevent re-renders
// Optimized for performance - heavily reduced for low-end PCs
const PARTICLE_CONFIG = {
  count: 15,           // was 80 → 40 → 15
  scale: 0.08,
  scaleVariation: 0.06,
  opacity: 1,
  speed: 0.2,
  colorR: 1.0,
  colorG: 0.8,
  colorB: 0.3,
};

const AmbientParticles = () => {
  const particlesRef = React.useRef([]);

  // Create sparkle texture
  const sparkleTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Create star-like sparkle
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    return new THREE.CanvasTexture(canvas);
  }, []);

  const particlesData = React.useMemo(() => {
    return Array.from({ length: PARTICLE_CONFIG.count }, () => {
      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          Math.random() * 6 - 1
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.01
        ),
        phase: Math.random() * Math.PI * 2,
        scale: PARTICLE_CONFIG.scale + Math.random() * PARTICLE_CONFIG.scaleVariation,
        colorVariation: Math.random() * 0.3 + 0.7,
        twinkleSpeed: Math.random() * 0.5 + 0.5,
      };
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        const data = particlesData[i];

        // Gentle floating motion with boundaries
        let newX = data.position.x + Math.sin(time * PARTICLE_CONFIG.speed * data.twinkleSpeed + data.phase) * 0.02;
        let newY = data.position.y + Math.cos(time * PARTICLE_CONFIG.speed * data.twinkleSpeed * 0.7 + data.phase * 1.3) * 0.015;
        let newZ = data.position.z + Math.sin(time * PARTICLE_CONFIG.speed * data.twinkleSpeed * 0.5 + data.phase * 0.7) * 0.01;

        // Wrap around boundaries for endless floating
        if (Math.abs(newX) > 6) newX = -Math.sign(newX) * 6;
        if (Math.abs(newY) > 4) newY = -Math.sign(newY) * 4;
        if (newZ > 6) newZ = -1;
        if (newZ < -1) newZ = 6;

        particle.position.set(newX, newY, newZ);
        data.position.set(newX, newY, newZ);

        // Twinkling effect
        const twinkle = Math.sin(time * data.twinkleSpeed * 2 + data.phase) * 0.3 + 0.7;
        particle.material.opacity = PARTICLE_CONFIG.opacity * twinkle;

        // Subtle scale pulsing
        const scalePulse = Math.sin(time * data.twinkleSpeed + data.phase) * 0.2 + 1;
        particle.scale.setScalar(data.scale * scalePulse);
      }
    });
  });

  return (
    <group>
      {particlesData.map((data, i) => (
        <sprite
          key={i}
          ref={(el) => (particlesRef.current[i] = el)}
          position={data.position}
          scale={data.scale}
        >
          <spriteMaterial
            map={sparkleTexture}
            color={new THREE.Color(
              PARTICLE_CONFIG.colorR * data.colorVariation,
              PARTICLE_CONFIG.colorG * data.colorVariation,
              PARTICLE_CONFIG.colorB * data.colorVariation
            )}
            transparent
            opacity={PARTICLE_CONFIG.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
};

export default AmbientParticles;
