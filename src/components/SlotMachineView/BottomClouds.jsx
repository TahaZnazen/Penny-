import React from 'react';
import { Cloud } from '@react-three/drei';

// Static configuration - moved outside component to prevent re-renders
const CLOUD_CONFIG = {
  count: 18,
  radius: 5.0,
  yPosition: -24.1,
  yRange: 3.9,
  zPosition: -31.0,
  segments: 40,
  boundsX: 8.0,
  boundsY: 3.0,
  boundsZ: 9.0,
  volume: 12.0,
  opacity: 1,
  speed: 0.20,
  growth: 1.0,
  fade: 21,
  goldenRatio: 0.6,
  whiteColor: '#ffffff',
  goldenColor: '#ff8800',
  scale: 2,
};

const BottomClouds = () => {
  // Create array of cloud configurations - only computed once on mount
  const clouds = React.useMemo(() => {
    return Array.from({ length: CLOUD_CONFIG.count }, (_, i) => {
      const angle = (i / CLOUD_CONFIG.count) * Math.PI * 2;
      const radius = CLOUD_CONFIG.radius * 0.6 + Math.random() * CLOUD_CONFIG.radius * 0.4;
      const isGolden = Math.random() < CLOUD_CONFIG.goldenRatio;

      return {
        position: [
          Math.cos(angle) * radius,
          CLOUD_CONFIG.yPosition + Math.random() * CLOUD_CONFIG.yRange,
          CLOUD_CONFIG.zPosition + Math.sin(angle) * (radius * 0.4)
        ],
        seed: i,
        segments: CLOUD_CONFIG.segments + Math.floor(Math.random() * 10),
        bounds: [CLOUD_CONFIG.boundsX, CLOUD_CONFIG.boundsY, CLOUD_CONFIG.boundsZ],
        color: isGolden ? CLOUD_CONFIG.goldenColor : CLOUD_CONFIG.whiteColor,
        opacity: CLOUD_CONFIG.opacity * (0.8 + Math.random() * 0.2),
        speed: CLOUD_CONFIG.speed + Math.random() * CLOUD_CONFIG.speed * 0.5,
        scale: CLOUD_CONFIG.scale,
      };
    });
  }, []);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.position}>
          {/* Base layer - wider, less opaque */}
          <Cloud
            seed={cloud.seed}
            fade={CLOUD_CONFIG.fade}
            speed={cloud.speed}
            growth={CLOUD_CONFIG.growth}
            segments={cloud.segments}
            volume={CLOUD_CONFIG.volume * 0.8}
            opacity={cloud.opacity}
            bounds={cloud.bounds}
            color={cloud.color}
            scale={cloud.scale}
          />
          {/* Top layer - tighter, more opaque for fluffy effect */}
          {/* <Cloud
            seed={cloud.seed + 100}
            fade={controls.fade}
            position={[0, 0.1, 0]}
            speed={cloud.speed * 0.5}
            growth={controls.growth}
            segments={cloud.segments}
            volume={controls.volume * 1.2}
            opacity={cloud.opacity}
            bounds={[cloud.bounds[0] * 0.7, cloud.bounds[1] * 1.2, cloud.bounds[2] * 0.7]}
            color={cloud.color}
            scale={cloud.scale}
          /> */}
        </group>
      ))}
    </group>
  );
};

export default BottomClouds;
