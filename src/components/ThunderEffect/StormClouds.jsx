import { useMemo } from 'react';
import { Cloud } from '@react-three/drei';
import { useControls } from 'leva';

const StormClouds = ({ thunderActive }) => {
  // Storm cloud configuration with Leva controls
  const controls = useControls('Storm Clouds', {
    count: { value: 12, min: 5, max: 30, step: 1, label: 'Cloud Count' },
    radius: { value: 5.0, min: 2, max: 20, step: 0.5, label: 'Spread Radius' },
    yPosition: { value: 26.5, min: 5, max: 30, step: 0.5, label: 'Y Position' },
    yRange: { value: 3.0, min: 0, max: 10, step: 0.5, label: 'Y Spread' },
    zPosition: { value: 0, min: -40, max: 40, step: 1, label: 'Z Position' },
    segments: { value: 50, min: 20, max: 100, step: 5, label: 'Cloud Segments' },
    boundsX: { value: 6.0, min: 2, max: 25, step: 0.5, label: 'Cloud Width' },
    boundsY: { value: 4.0, min: 1, max: 15, step: 0.5, label: 'Cloud Height' },
    boundsZ: { value: 5.0, min: 2, max: 20, step: 0.5, label: 'Cloud Depth' },
    volume: { value: 12.0, min: 5, max: 30, step: 1, label: 'Cloud Volume' },
    opacity: { value: 0.7, min: 0.1, max: 1, step: 0.05, label: 'Opacity' },
    speed: { value: 0.2, min: 0, max: 1, step: 0.05, label: 'Drift Speed' },
    growth: { value: 2.0, min: 0, max: 10, step: 0.5, label: 'Growth' },
    fade: { value: 30, min: 10, max: 50, step: 1, label: 'Fade Distance' },
    darkRatio: { value: 0.6, min: 0, max: 1, step: 0.1, label: 'Dark Cloud Ratio' },
    darkColor: { value: '#2c3e50', label: 'Dark Cloud Color' },
    lightColor: { value: '#7f8c8d', label: 'Light Cloud Color' },
    thunderColor: { value: '#a0c4ff', label: 'Thunder Flash Color' },
    scale: { value: 1.5, min: 0.5, max: 6, step: 0.1, label: 'Scale' },
  });

  // Create array of cloud configurations
  // Only regenerate positions when spatial properties change
  const clouds = useMemo(() => {
    return Array.from({ length: controls.count }, (_, i) => {
      const angle = (i / controls.count) * Math.PI * 2;
      const radius = controls.radius * 0.6 + Math.random() * controls.radius * 0.4;
      const isDark = Math.random() < controls.darkRatio;

      return {
        position: [
          Math.cos(angle) * radius,
          controls.yPosition + Math.random() * controls.yRange,
          controls.zPosition + Math.sin(angle) * (radius * 0.3)
        ],
        seed: i + 2000,
        segments: controls.segments + Math.floor(Math.random() * 20),
        bounds: [controls.boundsX, controls.boundsY, controls.boundsZ],
        color: isDark ? controls.darkColor : controls.lightColor,
        opacity: controls.opacity * (0.7 + Math.random() * 0.3),
        speed: controls.speed + Math.random() * controls.speed * 0.5,
        scale: controls.scale,
      };
    });
  }, [controls.count, controls.radius, controls.yPosition, controls.yRange, controls.zPosition, controls.darkRatio, controls.segments, controls.boundsX, controls.boundsY, controls.boundsZ, controls.darkColor, controls.lightColor, controls.opacity, controls.speed, controls.scale]);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.position}>
          {/* Base storm cloud layer */}
          <Cloud
            seed={cloud.seed}
            fade={controls.fade}
            speed={cloud.speed}
            growth={controls.growth}
            segments={cloud.segments}
            volume={controls.volume}
            opacity={cloud.opacity}
            bounds={cloud.bounds}
            color={thunderActive ? controls.thunderColor : cloud.color}
            scale={1}
          />
        </group>
      ))}
    </group>
  );
};

export default StormClouds;
