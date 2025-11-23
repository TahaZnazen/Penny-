import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const EdgeClouds = ({ count = 30 }) => {
  const spritesRef = React.useRef([]);

  // Create a circular gradient texture for soft cloud appearance
  const cloudTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Create radial gradient
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  const particlesData = React.useMemo(() => {
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 1.5;
      const height = -0.5 + Math.random() * 3;

      return {
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          2.5 + Math.sin(angle) * radius
        ),
        baseAngle: angle,
        baseRadius: radius,
        phase: Math.random() * Math.PI * 2,
        scale: 0.4 + Math.random() * 0.5,
        colorVariation: Math.random() * 0.3 + 0.7,
      };
    });
  }, [count]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    spritesRef.current.forEach((sprite, i) => {
      if (sprite) {
        const data = particlesData[i];
        const angle = data.baseAngle + time * 0.05;

        // Gentle floating motion
        const wave1 = Math.sin(time * 0.3 + data.phase) * 0.2;
        const wave2 = Math.cos(time * 0.2 + data.phase * 2) * 0.15;
        const verticalWave = Math.sin(time * 0.4 + data.phase) * 0.003;

        const radius = data.baseRadius + wave1;

        sprite.position.x = Math.cos(angle) * radius;
        sprite.position.y = data.position.y + verticalWave * 100;
        sprite.position.z = 2.5 + Math.sin(angle) * radius + wave2;

        // Pulsing opacity
        const opacityPulse = Math.sin(time * 0.5 + data.phase) * 0.1 + 0.3;
        sprite.material.opacity = opacityPulse;

        // Slight scale variation
        const scalePulse = Math.sin(time * 0.6 + data.phase) * 0.1 + 1;
        sprite.scale.setScalar(data.scale * scalePulse);
      }
    });
  });

  return (
    <group>
      {particlesData.map((data, i) => (
        <sprite
          key={i}
          ref={(el) => (spritesRef.current[i] = el)}
          position={data.position}
          scale={data.scale}
        >
          <spriteMaterial
            map={cloudTexture}
            color={new THREE.Color(
              1.0 * data.colorVariation,
              0.6 * data.colorVariation,
              0.1 * data.colorVariation
            )}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
};

export default EdgeClouds;
