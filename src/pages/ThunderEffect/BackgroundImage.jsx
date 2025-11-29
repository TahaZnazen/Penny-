import { useRef, useMemo, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Static configuration (previously Leva controls)
const CONFIG = {
  xPosition: 0.0,
  yPosition: -150,
  zPosition: -20,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale: 4.6,
  width: 50,
  height: 50,
  fitMode: 'cover',
  anchorBottom: true,
  yOffset: -9.0,
  opacity: 1,
  brightness: 0.8,
};

const BackgroundImage = ({ thunderActive = false }) => {
  const meshRef = useRef();
  const { viewport } = useThree();
  const aspectRatioRef = useRef(null);
  const viewportSizeRef = useRef(null);
  const [currentBrightness, setCurrentBrightness] = useState(CONFIG.brightness);

  // Load the background texture
  const texture = useTexture('/textures/loadingbg.jpeg');

  // Lock in aspect ratio ONCE
  if (aspectRatioRef.current === null && texture?.image) {
    aspectRatioRef.current = texture.image.width / texture.image.height;
  }

  // Lock in viewport size ONCE
  if (viewportSizeRef.current === null) {
    viewportSizeRef.current = {
      width: viewport.width,
      height: viewport.height
    };
  }

  const textureAspect = aspectRatioRef.current || 16 / 9;
  const viewportWidth = viewportSizeRef.current?.width || viewport.width;
  const viewportHeight = viewportSizeRef.current?.height || viewport.height;

  // Thunder brightness effect
  useEffect(() => {
    if (thunderActive) {
      setCurrentBrightness(3.1);
    } else {
      setCurrentBrightness(CONFIG.brightness);
    }
  }, [thunderActive]);

  // Calculate plane size and position
  const { planeWidth, planeHeight, finalYPosition } = useMemo(() => {
    const viewportAspect = viewportWidth / viewportHeight;
    let width, height;

    if (CONFIG.fitMode === 'manual') {
      width = CONFIG.width;
      height = CONFIG.height;
    } else if (CONFIG.fitMode === 'stretch') {
      width = viewportWidth * CONFIG.scale;
      height = viewportHeight * CONFIG.scale;
    } else if (CONFIG.fitMode === 'contain') {
      if (viewportAspect > textureAspect) {
        height = viewportHeight * CONFIG.scale;
        width = height * textureAspect;
      } else {
        width = viewportWidth * CONFIG.scale;
        height = width / textureAspect;
      }
    } else {
      // Cover mode (default)
      if (viewportAspect > textureAspect) {
        width = viewportWidth * CONFIG.scale;
        height = width / textureAspect;
      } else {
        height = viewportHeight * CONFIG.scale;
        width = height * textureAspect;
      }
    }

    let yPos = CONFIG.yPosition;
    if (CONFIG.anchorBottom) {
      yPos = -viewportHeight / 2 + height / 2 + CONFIG.yOffset;
    }

    return {
      planeWidth: width,
      planeHeight: height,
      finalYPosition: yPos,
    };
  }, [viewportWidth, viewportHeight, textureAspect]);

  const brightnessColor = useMemo(() => {
    return new THREE.Color(currentBrightness, currentBrightness, currentBrightness);
  }, [currentBrightness]);

  const geometryArgs = useMemo(() => [planeWidth, planeHeight], [planeWidth, planeHeight]);

  return (
    <mesh
      ref={meshRef}
      position={[CONFIG.xPosition, finalYPosition, CONFIG.zPosition]}
      rotation={[CONFIG.rotationX, CONFIG.rotationY, CONFIG.rotationZ]}
    >
      <planeGeometry args={geometryArgs} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        side={THREE.DoubleSide}
        transparent={CONFIG.opacity < 1}
        opacity={CONFIG.opacity}
        color={brightnessColor}
      />
    </mesh>
  );
};

export default BackgroundImage;
