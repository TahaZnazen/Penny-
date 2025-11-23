import React from 'react';
import { Cloud } from '@react-three/drei';

const BottomClouds = () => {
  // Hardcoded configuration
  const controls = {
    count: 45,
    radius: 5.0,
    yPosition: -24.1,
    yRange: 3.9,
    zPosition: -31.0,
    segments: 80,
    boundsX: 8.0,
    boundsY: 3.0,
    boundsZ: 9.0,
    volume: 12.0,
    opacity: 0.65,
    speed: 0.50,
    growth: 1.0,
    fade: 21,
    goldenRatio: 0.5,
    whiteColor: '#ffffff',
    goldenColor: '#ff8800',
    scale: 2,
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
        seed: i,
        segments: controls.segments + Math.floor(Math.random() * 10),
        bounds: [controls.boundsX, controls.boundsY, controls.boundsZ],
        color: isGolden ? controls.goldenColor : controls.whiteColor,
        opacity: controls.opacity * (0.8 + Math.random() * 0.2),
        speed: controls.speed + Math.random() * controls.speed * 0.5,
        scale:controls.scale,
      };
    });
  }, [controls]);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.position}>
          {/* Base layer - wider, less opaque */}
          <Cloud
            seed={cloud.seed}
            fade={controls.fade}
            speed={cloud.speed}
            growth={controls.growth}
            segments={cloud.segments}
            volume={controls.volume * 0.8}
            opacity={cloud.opacity * 1}
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
