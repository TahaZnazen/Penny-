import React, { useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useControls } from 'leva';
import StormClouds from './StormClouds';
import './ThunderEffect.css';

// Preload the models
useGLTF.preload('/models/piggybank.glb');
useGLTF.preload('/models/pillar.glb');

// Camera updater component - updates camera position when GUI changes
const CameraUpdater = ({ cameraX, cameraY, cameraZ, fov }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, cameraX, cameraY, cameraZ, fov]);

  return null;
};

// Piggy Bank Target Model component
const PiggyBankTarget = ({ position, scale, rotation }) => {
  // useGLTF automatically handles Draco-compressed models
  const { scene } = useGLTF('/models/piggybank.glb');

  // Clone the scene to allow multiple instances if needed
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    // Enable shadows for all children
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
};

// Pillar Model component
const Pillar = ({ position, scale, rotation }) => {
  const { scene } = useGLTF('/models/pillar.glb');

  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
};

// Lightning bolt component
const LightningBolt = ({ active, position = [0, 5, 0], config }) => {
  const [intensity, setIntensity] = useState(0);

  useFrame(() => {
    if (active) {
      // Flash effect with configurable intensity
      setIntensity(Math.random() * config.maxIntensity + config.minIntensity);
    } else {
      setIntensity(0);
    }
  });

  return (
    <>
      <pointLight
        position={position}
        intensity={intensity}
        color={config.color}
        distance={config.distance}
        decay={config.decay}
      />
      <pointLight
        position={[position[0], position[1] - 2, position[2]]}
        intensity={intensity * 0.5}
        color="#ffffff"
        distance={config.distance * 0.6}
      />
    </>
  );
};

// Thunder scene
const ThunderScene = ({ thunderActive, canvasControls }) => {
  // Lighting controls
  const lightingControls = useControls('Lighting', {
    ambientIntensityInactive: { value: 0.15, min: 0, max: 2, step: 0.05, label: 'Ambient (Inactive)' },
    ambientIntensityActive: { value: 0.8, min: 0, max: 2, step: 0.05, label: 'Ambient (Active)' },
    directionalIntensityInactive: { value: 0.3, min: 0, max: 2, step: 0.05, label: 'Directional (Inactive)' },
    directionalIntensityActive: { value: 2.0, min: 0, max: 5, step: 0.1, label: 'Directional (Active)' },
    directionalPosition: { value: [10, 10, 5], label: 'Directional Position' },
  });

  // Lightning controls
  const lightningControls = useControls('Lightning', {
    minIntensity: { value: 5, min: 0, max: 20, step: 1, label: 'Min Intensity' },
    maxIntensity: { value: 15, min: 5, max: 30, step: 1, label: 'Max Intensity' },
    color: { value: '#a0c4ff', label: 'Lightning Color' },
    distance: { value: 50, min: 10, max: 100, step: 5, label: 'Light Distance' },
    decay: { value: 2, min: 0, max: 5, step: 0.1, label: 'Light Decay' },
    boltCount: { value: 5, min: 1, max: 10, step: 1, label: 'Bolt Count' },
  });

  // Target model controls (Piggy Bank)
  const targetControls = useControls('Target Model', {
    positionX: { value: 0.0, min: -20, max: 20, step: 0.5, label: 'X Position' },
    positionY: { value: 3.5, min: -50, max: 10, step: 0.5, label: 'Y Position' },
    positionZ: { value: 0, min: -20, max: 20, step: 0.5, label: 'Z Position' },
    scale: { value: 6.9, min: 0.1, max: 10, step: 0.1, label: 'Scale' },
    rotationX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1, label: 'Rotation X' },
    rotationY: { value: 0.5, min: -Math.PI, max: Math.PI, step: 0.1, label: 'Rotation Y' },
    rotationZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1, label: 'Rotation Z' },
  });

  // Pillar offset controls (relative to piggy bank)
  const pillarOffsets = useControls('Pillar Offsets', {
    rotationXMultiplier: { value: 5, min: 0, max: 10, step: 0.5, label: 'Rotation X Multiplier' },
    rotationY: { value: -2.3, min: -Math.PI, max: Math.PI, step: 0.1, label: 'Rotation Y' },
    rotationZMultiplier: { value: 1, min: 0, max: 10, step: 0.5, label: 'Rotation Z Multiplier' },
    positionYMultiplier: { value: -2.5, min: -5, max: 5, step: 0.1, label: 'Y Position Multiplier' },
    scale: { value: 20, min: 0.1, max: 50, step: 0.5, label: 'Scale' },
  });

  // Camera controls
  const cameraControls = useControls('Camera', {
    minDistance: { value: 10, min: 1, max: 20, step: 1, label: 'Min Distance' },
    maxDistance: { value: 50, min: 20, max: 100, step: 5, label: 'Max Distance' },
    maxPolarAngle: { value: Math.PI / 2, min: 0, max: Math.PI, step: 0.1, label: 'Max Polar Angle' },
  });

  // Generate lightning bolt positions - positioned above clouds to strike downward
  const lightningBolts = React.useMemo(() => {
    return Array.from({ length: lightningControls.boltCount }, (_, i) => {
      const angle = (i / lightningControls.boltCount) * Math.PI * 2;
      const radius = 2 + Math.random() * 2;
      return {
        position: [
          Math.cos(angle) * radius,
          18 + Math.random() * 3,  // Above clouds (clouds are at Y: 15-18)
          Math.sin(angle) * radius
        ]
      };
    });
  }, [lightningControls.boltCount]);

  return (
    <>
      {/* Camera updater - syncs camera with GUI controls */}
      <CameraUpdater
        cameraX={canvasControls.cameraX}
        cameraY={canvasControls.cameraY}
        cameraZ={canvasControls.cameraZ}
        fov={canvasControls.fov}
      />

      {/* Ambient lighting */}
      <ambientLight
        intensity={thunderActive ? lightingControls.ambientIntensityActive : lightingControls.ambientIntensityInactive}
      />

      {/* Main directional light */}
      <directionalLight
        position={lightingControls.directionalPosition}
        intensity={thunderActive ? lightingControls.directionalIntensityActive : lightingControls.directionalIntensityInactive}
        color="#ffffff"
      />

      {/* Storm clouds */}
      <StormClouds thunderActive={thunderActive} />

      {/* Lightning bolts at different positions */}
      {lightningBolts.map((bolt, i) => (
        <LightningBolt
          key={i}
          active={thunderActive}
          position={bolt.position}
          config={lightningControls}
        />
      ))}

      {/* Pillar (under piggy bank) */}
      <Pillar
        position={[
          targetControls.positionX,
          targetControls.positionY * pillarOffsets.positionYMultiplier,
          targetControls.positionZ
        ]}
        scale={pillarOffsets.scale}
        rotation={[
          targetControls.rotationX * pillarOffsets.rotationXMultiplier,
          pillarOffsets.rotationY,
          targetControls.rotationZ * pillarOffsets.rotationZMultiplier
        ]}
      />

      {/* Piggy Bank Target Model */}
      <PiggyBankTarget
        position={[targetControls.positionX-0.5, targetControls.positionY, targetControls.positionZ]}
        scale={targetControls.scale}
        rotation={[targetControls.rotationX, targetControls.rotationY, targetControls.rotationZ]}
      />

      {/* Camera controls */}
      <OrbitControls
        target={[canvasControls.targetX, canvasControls.targetY, canvasControls.targetZ]}
        enableZoom={true}
        enableRotate={true}
        enablePan={true}
        minDistance={cameraControls.minDistance}
        maxDistance={cameraControls.maxDistance}
        maxPolarAngle={cameraControls.maxPolarAngle}
      />
    </>
  );
};

const ThunderEffect = () => {
  const navigate = useNavigate();
  const [thunderActive, setThunderActive] = useState(false);
  const [autoThunder, setAutoThunder] = useState(true);

  // Canvas controls
  const canvasControls = useControls('Canvas', {
    cameraX: { value: 45, min: -50, max: 150, step: 1, label: 'Camera X' },
    cameraY: { value: 3, min: -10, max: 140, step: 1, label: 'Camera Y' },
    cameraZ: { value: 7, min: -50, max: 150, step: 1, label: 'Camera Z' },
    fov: { value: 50, min: 30, max: 120, step: 5, label: 'Field of View' },
    targetX: { value: 0, min: -50, max: 50, step: 1, label: 'Look At X' },
    targetY: { value: 13, min: -10, max: 30, step: 1, label: 'Look At Y' },
    targetZ: { value: 0, min: -50, max: 50, step: 1, label: 'Look At Z' },
  });

  // Auto thunder effect
  useEffect(() => {
    if (!autoThunder) return;

    const thunderInterval = setInterval(() => {
      setThunderActive(true);

      // Thunder duration
      setTimeout(() => {
        setThunderActive(false);
      }, 200 + Math.random() * 300);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(thunderInterval);
  }, [autoThunder]);

  const goHome = () => {
    navigate('/');
  };

  const triggerThunder = () => {
    setThunderActive(true);
    setTimeout(() => setThunderActive(false), 300);
  };

  return (
    <div className="thunder-effect-container">
      {/* Sky background that flashes */}
      <div className={`sky-background ${thunderActive ? 'flash' : ''}`} />

      {/* 3D Thunder Scene */}
      <Canvas
        shadows
        camera={{
          position: [canvasControls.cameraX, canvasControls.cameraY, canvasControls.cameraZ],
          fov: canvasControls.fov
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ThunderScene thunderActive={thunderActive} canvasControls={canvasControls} />
      </Canvas>

      {/* Controls UI */}
      <div className="thunder-controls">
        {/* <h1 className="thunder-title">⚡ Thunder Effect ⚡</h1> */}

        <div className="controls-panel">
          <button className="btn btn-trigger" onClick={triggerThunder}>
            Trigger Thunder
          </button>

          {/* <label className="auto-toggle">
            <input
              type="checkbox"
              checked={autoThunder}
              onChange={(e) => setAutoThunder(e.target.checked)}
            />
            <span>Auto Thunder</span>
          </label>

          <button className="btn btn-home" onClick={goHome}>
            ← Back to Home
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ThunderEffect;
