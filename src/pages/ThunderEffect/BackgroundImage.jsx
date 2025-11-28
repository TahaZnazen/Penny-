import { useRef, useMemo, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';

const BackgroundImage = ({ thunderActive = false }) => {
  const meshRef = useRef();
  const { viewport } = useThree();
  const aspectRatioRef = useRef(null);
  const viewportSizeRef = useRef(null);
  const [currentBrightness, setCurrentBrightness] = useState(0.8);

  // Load the background texture (suspends until loaded)
  const texture = useTexture('/textures/loadingbg.jpeg');

  // Lock in aspect ratio ONCE - never change it
  if (aspectRatioRef.current === null && texture?.image) {
    aspectRatioRef.current = texture.image.width / texture.image.height;
  }

  // Lock in viewport size ONCE - never change it (prevents scaling during thunder/camera changes)
  if (viewportSizeRef.current === null) {
    viewportSizeRef.current = {
      width: viewport.width,
      height: viewport.height
    };
  }

  // Use locked values
  const textureAspect = aspectRatioRef.current || 16 / 9;
  const viewportWidth = viewportSizeRef.current?.width || viewport.width;
  const viewportHeight = viewportSizeRef.current?.height || viewport.height;

  // Background controls
  const controls = useControls('Background Image', {
    // Position controls
    xPosition: { value: 0.0, min: -100, max: 100, step: 0.5, label: 'X Position' },
    yPosition: { value: 0, min: -100, max: 100, step: 0.5, label: 'Y Position' },
    zPosition: { value: -20, min: -200, max: 50, step: 1, label: 'Z Position' },

    // Rotation controls (in radians)
    rotationX: { value: 0, min: -Math.PI * 2, max: Math.PI * 2, step: 0.01, label: 'Rotation X' },
    rotationY: { value: 0, min: -Math.PI * 2, max: Math.PI * 2, step: 0.01, label: 'Rotation Y' },
    rotationZ: { value: 0, min: -Math.PI * 2, max: Math.PI * 2, step: 0.01, label: 'Rotation Z' },

    // Scale and sizing
    scale: { value: 4.6, min: 0.1, max: 10, step: 0.1, label: 'Scale' },
    width: { value: 50, min: 1, max: 200, step: 1, label: 'Manual Width' },
    height: { value: 50, min: 1, max: 200, step: 1, label: 'Manual Height' },

    // Display options
    fitMode: {
      value: 'contain',
      options: ['cover', 'contain', 'stretch', 'manual'],
      label: 'Fit Mode'
    },
    anchorBottom: { value: true, label: 'Anchor Bottom Center' },
    yOffset: { value: -9.0, min: -50, max: 50, step: 0.5, label: 'Y Offset (Anchor)' },

    // Visual properties
    opacity: { value: 1, min: 0, max: 1, step: 0.05, label: 'Opacity' },
    brightness: { value: 0.8, min: 0, max: 5, step: 0.1, label: 'Brightness' },
  });

  // Thunder brightness effect
  useEffect(() => {
    if (thunderActive) {
      setCurrentBrightness(3.1);
    } else {
      setCurrentBrightness(controls.brightness);
    }
  }, [thunderActive, controls.brightness]);

  // Update brightness when control changes (but not during thunder)
  useEffect(() => {
    if (!thunderActive) {
      setCurrentBrightness(controls.brightness);
    }
  }, [controls.brightness, thunderActive]);

  // Calculate plane size and position based on viewport
  const { planeWidth, planeHeight, finalYPosition } = useMemo(() => {
    const viewportAspect = viewportWidth / viewportHeight;

    let width, height;

    // Different fit modes
    if (controls.fitMode === 'manual') {
      // Manual size control
      width = controls.width;
      height = controls.height;
    } else if (controls.fitMode === 'stretch') {
      // Stretch to fill viewport exactly
      width = viewportWidth * controls.scale;
      height = viewportHeight * controls.scale;
    } else if (controls.fitMode === 'contain') {
      // Fit entire image within viewport
      if (viewportAspect > textureAspect) {
        height = viewportHeight * controls.scale;
        width = height * textureAspect;
      } else {
        width = viewportWidth * controls.scale;
        height = width / textureAspect;
      }
    } else {
      // Cover mode (default) - fill viewport while maintaining aspect ratio
      if (viewportAspect > textureAspect) {
        width = viewportWidth * controls.scale;
        height = width / textureAspect;
      } else {
        height = viewportHeight * controls.scale;
        width = height * textureAspect;
      }
    }

    // Calculate Y position
    let yPos = controls.yPosition;
    if (controls.anchorBottom) {
      // Position so the bottom of the plane aligns with bottom of viewport
      // This keeps the piggy and pillar (at bottom) always visible
      yPos = -viewportHeight / 2 + height / 2 + controls.yOffset;
    }

    return {
      planeWidth: width,
      planeHeight: height,
      finalYPosition: yPos,
    };
  }, [viewportWidth, viewportHeight, textureAspect, controls.scale, controls.yOffset, controls.yPosition, controls.anchorBottom, controls.fitMode, controls.width, controls.height]);

  // Memoize the brightness color to prevent recreating on every render
  const brightnessColor = useMemo(() => {
    return new THREE.Color(currentBrightness, currentBrightness, currentBrightness);
  }, [currentBrightness]);

  // Memoize geometry args to prevent recreation
  const geometryArgs = useMemo(() => [planeWidth, planeHeight], [planeWidth, planeHeight]);

  return (
    <mesh
      ref={meshRef}
      position={[controls.xPosition, finalYPosition, controls.zPosition]}
      rotation={[controls.rotationX, controls.rotationY, controls.rotationZ]}
    >
      <planeGeometry args={geometryArgs} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        side={THREE.DoubleSide}
        transparent={controls.opacity < 1}
        opacity={controls.opacity}
        color={brightnessColor}
      />
    </mesh>
  );
};

export default BackgroundImage;
