import React from 'react';
import { Cloud } from '@react-three/drei';

const TopClouds = () => {
  // Hardcoded configuration
  const controls = {
    count: 5,
    radius: 1.6,
    yPosition: -10.0,
    yRange: 10.0,
    zPosition: 4.0,
    segments: 25,
    boundsX: 15.0,
    boundsY: 10.0,
    boundsZ: 8.6,
    volume: 20.0,
    opacity: 0.35,
    speed: 0.05,
    growth: 4.0,
    fade: 24,
    goldenRatio: 0.3,
    whiteColor: '#ffffff',
    goldenColor: '#ffa800',
    scale: 1.1,
  };

  // Create array of cloud configurations
  const clouds = React.useMemo(() => {
    return Array.from({ length: controls.count }, (_, i) => {
      const angle = (i / controls.count) * Math.PI * 2;
      const radius = controls.radius * 0.6 + Math.random() * controls.radius * 0.4;
      const isGolden = Math.random() < controls.goldenRatio;

      return {
        position: [
          Math.cos(angle) * radius,
          controls.yPosition + Math.random() * controls.yRange,
          controls.zPosition + Math.sin(angle) * (radius * 0.4)
        ],
        seed: i + 1000, // Different seed range from bottom clouds
        segments: controls.segments + Math.floor(Math.random() * 10),
        bounds: [controls.boundsX, controls.boundsY, controls.boundsZ],
        color: isGolden ? controls.goldenColor : controls.whiteColor,
        opacity: controls.opacity * (0.8 + Math.random() * 0.2),
        speed: controls.speed + Math.random() * controls.speed * 0.5,
        scale: controls.scale,
      };
    });
  }, [controls]);

  return (
    <group >
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.position}>
          {/* Single layer for top clouds */}
          <Cloud
            seed={cloud.seed}
            fade={controls.fade}
            speed={cloud.speed}
            growth={controls.growth}
            segments={cloud.segments}
            volume={controls.volume}
            opacity={cloud.opacity}
            bounds={cloud.bounds}
            color={cloud.color}
            scale={cloud.scale}
          />
        </group>
      ))}
    </group>
  );
};

export default TopClouds;
