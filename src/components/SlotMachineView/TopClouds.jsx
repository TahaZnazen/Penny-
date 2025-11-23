import React from 'react';
import { Cloud } from '@react-three/drei';
import { useControls } from 'leva';

const TopClouds = () => {
  // Leva GUI controls
  const controls = useControls('Top Clouds', {
    count: { value: 5, min: 5, max: 100, step: 1, label: 'Cloud Count' },
    radius: { value: 1.6, min: 1, max: 10, step: 0.1, label: 'Spread Radius' },
    yPosition: { value: -10.0, min: -50, max: 20, step: 0.1, label: 'Y Position' },
    yRange: { value: 10.0, min: 0.1, max: 20, step: 0.1, label: 'Y Spread' },
    zPosition: { value: 4.0, min: -100, max: 50, step: 0.1, label: 'Z Position' },
    segments: { value: 25, min: 10, max: 120, step: 5, label: 'Cloud Segments (Fluffiness)' },
    boundsX: { value: 15.0, min: 0.5, max: 30, step: 0.1, label: 'Cloud Width' },
    boundsY: { value: 10.0, min: 0.2, max: 20, step: 0.1, label: 'Cloud Height' },
    boundsZ: { value: 8.6, min: 0.5, max: 20, step: 0.1, label: 'Cloud Depth' },
    volume: { value: 20.0, min: 1, max: 30, step: 0.5, label: 'Cloud Volume (Thickness)' },
    opacity: { value: 0.35, min: 0.1, max: 1, step: 0.05, label: 'Cloud Opacity' },
    speed: { value: 0.05, min: 0, max: 1, step: 0.05, label: 'Drift Speed' },
    growth: { value: 4.0, min: 0, max: 10, step: 0.5, label: 'Growth Animation' },
    fade: { value: 24, min: 5, max: 50, step: 1, label: 'Fade Distance' },
    goldenRatio: { value: 0.3, min: 0, max: 1, step: 0.1, label: 'Golden Ratio (0=white, 1=gold)' },
    whiteColor: { value: '#ffffff', label: 'White Cloud Color' },
    goldenColor: { value: '#ffa800', label: 'Golden Cloud Color' },
    scale: { value: 1.1, min: -50, max: 30, step: 0.1, label: 'scale' },
  });

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
