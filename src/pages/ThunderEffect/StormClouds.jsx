import { useMemo } from 'react';
import { Cloud } from '@react-three/drei';

// Static configuration (previously Leva controls)
const CONFIG = {
  count: 12,
  radius: 20.0,
  yPosition: 21.5,
  yRange: 3.0,
  zPosition: -22,
  segments: 50,
  boundsX: 6.0,
  boundsY: 4.0,
  boundsZ: 5.0,
  volume: 12.0,
  opacity: 0.7,
  speed: 0.2,
  growth: 2.0,
  fade: 30,
  darkRatio: 0.6,
  darkColor: '#2c3e50',
  lightColor: '#7f8c8d',
  thunderColor: '#a0c4ff',
  scale: 1.5,
};

const StormClouds = ({ thunderActive }) => {
  // Create array of cloud configurations
  const clouds = useMemo(() => {
    return Array.from({ length: CONFIG.count }, (_, i) => {
      const angle = (i / CONFIG.count) * Math.PI * 2;
      const radius = CONFIG.radius * 0.6 + Math.random() * CONFIG.radius * 0.4;
      const isDark = Math.random() < CONFIG.darkRatio;

      return {
        position: [
          Math.cos(angle) * radius,
          CONFIG.yPosition + Math.random() * CONFIG.yRange,
          CONFIG.zPosition + Math.sin(angle) * (radius * 0.3)
        ],
        seed: i + 2000,
        segments: CONFIG.segments + Math.floor(Math.random() * 20),
        bounds: [CONFIG.boundsX, CONFIG.boundsY, CONFIG.boundsZ],
        color: isDark ? CONFIG.darkColor : CONFIG.lightColor,
        opacity: CONFIG.opacity * (0.7 + Math.random() * 0.3),
        speed: CONFIG.speed + Math.random() * CONFIG.speed * 0.5,
        scale: CONFIG.scale,
      };
    });
  }, []);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.position}>
          <Cloud
            seed={cloud.seed}
            fade={CONFIG.fade}
            speed={cloud.speed}
            growth={CONFIG.growth}
            segments={cloud.segments}
            volume={CONFIG.volume}
            opacity={cloud.opacity}
            bounds={cloud.bounds}
            color={thunderActive ? CONFIG.thunderColor : cloud.color}
            scale={1}
          />
        </group>
      ))}
    </group>
  );
};

export default StormClouds;
