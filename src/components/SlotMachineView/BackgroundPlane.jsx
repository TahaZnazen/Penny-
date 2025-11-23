import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const BackgroundPlane = () => {
  const texture = useLoader(THREE.TextureLoader, '/textures/bg0.png');
  const meshRef = React.useRef();

  // Hardcoded values
  const config = {
    width: 42,
    height: 22,
    positionX: 2.0,
    positionY: 0.0,
    positionZ: -30.1,
    opacity: 1.00,
    brightness: 2.5,
    textureScale: 1.0,
    textureOffsetX: 0.00,
    textureOffsetY: -0.01,
  };

  // Apply texture settings
  React.useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(config.textureScale, config.textureScale);
      texture.offset.set(config.textureOffsetX, config.textureOffsetY);
    }
  }, [texture]);

  return (
    <mesh
      ref={meshRef}
      position={[config.positionX, config.positionY, config.positionZ]}
      scale={1.5}
    >
      <planeGeometry args={[config.width, config.height]}  />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={config.opacity}
        color={new THREE.Color(config.brightness, config.brightness, config.brightness)}
        depthWrite={false}
      />
    </mesh>
  );
};

export default BackgroundPlane;
