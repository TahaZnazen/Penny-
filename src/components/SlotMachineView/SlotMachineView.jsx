import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model } from '../SlotMachineModel';
import TVScreenInGap from '../TVScreenInGap/TVScreenInGap';
import JackpotScreen from '../JackpotScreen/JackpotScreen';
import BackgroundPlane from './BackgroundPlane';
import BottomClouds from './BottomClouds';
import TopClouds from './TopClouds';
import AmbientParticles from './AmbientParticles';
import EdgeClouds from './EdgeClouds';
import * as THREE from 'three';
import './SlotMachineView.css';

const SlotMachineScene = ({ onJackpot, introComplete }) => {
  const modelRef = React.useRef();
  const groupRef = React.useRef();
  const [jackpotTriggered, setJackpotTriggered] = React.useState(false);
  const [showScreen, setShowScreen] = React.useState(true);

  // Intro animation - machine and screen slide up from bottom (pure translation, no scale)
  useFrame((state) => {
    if (!introComplete) {
      const elapsed = state.clock.elapsedTime;

      if (groupRef.current) {
        if (elapsed < 2) {
          // Pure slide up - no scaling, perfect synchronization
          const progress = Math.min(elapsed / 2, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

          // Start below viewport and slide up to neutral position
          const startY = -10;
          const endY = 0;
          groupRef.current.position.set(0, startY + (endY - startY) * eased, 0);
        } else {
          // Reset to neutral
          groupRef.current.position.set(0, 0, 0);
        }
      }
    } else {
      // Animation complete - ensure group is neutral
      if (groupRef.current) {
        groupRef.current.position.set(0, 0, 0);
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
      {/* Background plane */}
      <BackgroundPlane />

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

      {/* Bottom cloud layer - creates floating effect */}
      <BottomClouds />

      {/* Top cloud layer - creates depth above the scene */}

      {/* Ambient sparkle particles throughout scene */}
      <AmbientParticles />

      {/* Animated group for machine and screen - they fly in together */}
      <group ref={groupRef} position={[0 , 0 ,0]}>
        {/* Slot Machine Model with explosion capability */}
        <Model
          ref={modelRef}
          position={[0, 0, 2.5]}
          scale={1}
          rotation={[0.2, 0, 0]}
          castShadow
          receiveShadow
        />

        {/* Screen with SlotGame embedded in 3D space - hidden during explosion */}
        {showScreen && <TVScreenInGap onJackpot={handleJackpot} />}

        {/* Floating clouds around the model edges */}
        {/* <EdgeClouds count={30} /> */}
      </group>
      {/* <TopClouds /> */}

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
