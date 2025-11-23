import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model } from '../SlotMachineModel';
import TVScreenInGap from '../TVScreenInGap/TVScreenInGap';
import JackpotScreen from '../JackpotScreen/JackpotScreen';
import * as THREE from 'three';
import './SlotMachineView.css';

// Floating clouds around the model edges using sprites
const EdgeClouds = ({ count = 30 }) => {
  const spritesRef = React.useRef([]);

  // Create a circular gradient texture for soft cloud appearance
  const cloudTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Create radial gradient
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  const particlesData = React.useMemo(() => {
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 1.5;
      const height = -0.5 + Math.random() * 3;

      return {
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          2.5 + Math.sin(angle) * radius
        ),
        baseAngle: angle,
        baseRadius: radius,
        phase: Math.random() * Math.PI * 2,
        scale: 0.4 + Math.random() * 0.5,
        colorVariation: Math.random() * 0.3 + 0.7,
      };
    });
  }, [count]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    spritesRef.current.forEach((sprite, i) => {
      if (sprite) {
        const data = particlesData[i];
        const angle = data.baseAngle + time * 0.05;

        // Gentle floating motion
        const wave1 = Math.sin(time * 0.3 + data.phase) * 0.2;
        const wave2 = Math.cos(time * 0.2 + data.phase * 2) * 0.15;
        const verticalWave = Math.sin(time * 0.4 + data.phase) * 0.003;

        const radius = data.baseRadius + wave1;

        sprite.position.x = Math.cos(angle) * radius;
        sprite.position.y = data.position.y + verticalWave * 100;
        sprite.position.z = 2.5 + Math.sin(angle) * radius + wave2;

        // Pulsing opacity
        const opacityPulse = Math.sin(time * 0.5 + data.phase) * 0.1 + 0.3;
        sprite.material.opacity = opacityPulse;

        // Slight scale variation
        const scalePulse = Math.sin(time * 0.6 + data.phase) * 0.1 + 1;
        sprite.scale.setScalar(data.scale * scalePulse);
      }
    });
  });

  return (
    <group>
      {particlesData.map((data, i) => (
        <sprite
          key={i}
          ref={(el) => (spritesRef.current[i] = el)}
          position={data.position}
          scale={data.scale}
        >
          <spriteMaterial
            map={cloudTexture}
            color={new THREE.Color(
              1.0 * data.colorVariation,
              0.6 * data.colorVariation,
              0.1 * data.colorVariation
            )}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
};

const SlotMachineScene = ({ onJackpot, introComplete }) => {
  const modelRef = React.useRef();
  const groupRef = React.useRef();
  const screenGroupRef = React.useRef();
  const [jackpotTriggered, setJackpotTriggered] = React.useState(false);
  const [showScreen, setShowScreen] = React.useState(true);

  // Intro animation - machine flies in
  useFrame((state) => {
    if (!introComplete) {
      const elapsed = state.clock.elapsedTime;

      if (groupRef.current) {
        if (elapsed < 2) {
          // Machine flies in from distance with easing
          const progress = Math.min(elapsed / 2, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

          // Start far away and zoom in
          const startZ = 7.5;
          const endZ = 0;
          groupRef.current.position.set(0, 0, startZ + (endZ - startZ) * eased);

          // Scale up from small
          const scale = 0.3 + (0.7 * eased);
          groupRef.current.scale.setScalar(scale);

          // Slight rotation for dramatic effect
          groupRef.current.rotation.y = (1 - eased) * Math.PI * 2;
        } else {
          // Reset to neutral - let children's hardcoded positions take over
          groupRef.current.position.set(0, 0, 0);
          groupRef.current.scale.set(1, 1, 1);
          groupRef.current.rotation.set(0, 0, 0);
        }
      }

      // Screen fades in after machine
      if (screenGroupRef.current) {
        if (elapsed <= 1.5) {
          screenGroupRef.current.scale.setScalar(0);
        } else if (elapsed < 3) {
          const progress = Math.min((elapsed - 1.5) / 1.5, 1);
          screenGroupRef.current.scale.setScalar(progress);
        } else {
          // Reset to neutral
          screenGroupRef.current.scale.set(1, 1, 1);
        }
      }
    } else {
      // Animation complete - ensure groups are neutral
      if (groupRef.current) {
        groupRef.current.position.set(0, 0, 0);
        groupRef.current.scale.set(1, 1, 1);
        groupRef.current.rotation.set(0, 0, 0);
      }
      if (screenGroupRef.current) {
        screenGroupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  // Trigger explosion when jackpot happens
  React.useEffect(() => {
    if (jackpotTriggered && modelRef.current) {
      console.log('🎰 JACKPOT! Triggering explosion...');
      modelRef.current.explode();
      setShowScreen(false); // Hide TV screen during explosion
    }
  }, [jackpotTriggered]);

  const handleJackpot = () => {
    console.log('🎊 Jackpot detected in scene!');
    setJackpotTriggered(true);

    // Trigger parent jackpot screen
    if (onJackpot) {
      onJackpot();
    }
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, -10, -6]} intensity={1} />

      {/* Ground plane to receive shadows */}
      <mesh
        rotation={[-Math.PI / 2, 0, 1]}
        position={[0, -0.8, 0]}
        receiveShadow
      >
        {/* <planeGeometry args={[25, 50]} /> */}
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Animated group for machine */}
      <group ref={groupRef}>
        {/* Slot Machine Model with explosion capability */}
        <Model
          ref={modelRef}
          position={[0, 0, 2.5]}
          scale={1}
          rotation={[0.2, 0, 0]}
          castShadow
          receiveShadow
        />

        {/* Floating clouds around the model edges */}
        <EdgeClouds count={30} />
      </group>

      {/* Animated group for screen */}
      <group ref={screenGroupRef}>
        {/* Screen with SlotGame embedded in 3D space - hidden during explosion */}
        {showScreen && <TVScreenInGap onJackpot={handleJackpot} />}
      </group>

      {/* Camera Controls - Disabled zoom and rotation */}
      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
      />
    </>
  );
};

const SlotMachineView = () => {
  const [showJackpotScreen, setShowJackpotScreen] = React.useState(false);
  const [introComplete, setIntroComplete] = React.useState(false);

  // Mark intro as complete after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIntroComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleJackpot = () => {
    setShowJackpotScreen(true);

    // Hide jackpot screen after 4 seconds
    // setTimeout(() => {
    //   setShowJackpotScreen(false);
    // }, 4000);
  };

  return (
    <div className="slot-machine-view">
      {/* Jackpot Win Screen Overlay */}
      <JackpotScreen show={showJackpotScreen} />

      {/* 3D Slot Machine Model with integrated screen */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <SlotMachineScene onJackpot={handleJackpot} introComplete={introComplete} />
      </Canvas>
    </div>
  );
};

export default SlotMachineView;
