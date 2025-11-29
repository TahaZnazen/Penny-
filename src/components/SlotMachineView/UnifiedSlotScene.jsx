import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { PiggyBank } from '../PiggyBank';
import { Model } from '../SlotMachineModel';
import TVScreenInGap from '../TVScreenInGap/TVScreenInGap';
import BackgroundPlane from './BackgroundPlane';
import BottomClouds from './BottomClouds';
import AmbientParticles from './AmbientParticles';

/**
 * UnifiedSlotScene - Combines Piggy Bank breaking and Slot Machine in one scene
 *
 * Phases:
 * - 'piggy': Show piggy bank, user breaks it
 * - 'slot-machine': Show slot machine after coin click
 *
 * @param {string} phase - Current phase ('piggy' | 'slot-machine')
 * @param {Function} onPhaseChange - Called when phase should change
 * @param {Function} onPennyWin - Called when all 5 pennies
 * @param {Function} onPigJackpot - Called when all 5 pigs (jackpot)
 */
const UnifiedSlotScene = ({ phase, onPhaseChange, onPennyWin, onPigJackpot }) => {
  const modelRef = React.useRef();
  const groupRef = React.useRef();
  const piggyGroupRef = React.useRef();
  const [jackpotTriggered, setJackpotTriggered] = React.useState(false);
  const [pennyWinTriggered, setPennyWinTriggered] = React.useState(false);
  const [showScreen, setShowScreen] = React.useState(true);
  const [piggyBroken, setPiggyBroken] = React.useState(false);

  // Drag-to-rotate state for piggy bank
  const [isDragging, setIsDragging] = React.useState(false);
  const [piggyRotation, setPiggyRotation] = React.useState(0);
  const lastX = React.useRef(0);
  const { gl } = useThree();

  // Handle drag rotation for piggy
  React.useEffect(() => {
    if (phase !== 'piggy') return;

    const handlePointerDown = (e) => {
      setIsDragging(true);
      lastX.current = e.clientX;
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastX.current;
      setPiggyRotation(prev => prev + deltaX * 0.01);
      lastX.current = e.clientX;
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [phase, isDragging, gl]);

  // Intro animation for slot machine - slides up from bottom
  useFrame((state) => {
    if (phase === 'slot-machine' && groupRef.current) {
      const elapsed = state.clock.elapsedTime;

      if (elapsed < 2) {
        const progress = Math.min(elapsed / 2, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const startY = -10;
        const endY = 0;
        groupRef.current.position.set(0, startY + (endY - startY) * eased, 0);
      } else {
        groupRef.current.position.set(0, 0, 0);
      }
    }
  });

  // Handle piggy bank broken state
  const handlePiggyBroken = (broken) => {
    setPiggyBroken(broken);
  };

  // Handle coin click - transition to slot machine
  const handleCoinClick = () => {
    console.log('Coin clicked! Transitioning to slot machine...');
    if (onPhaseChange) {
      onPhaseChange('slot-machine');
    }
  };

  // Trigger explosion when jackpot (pig) happens
  React.useEffect(() => {
    if (jackpotTriggered && modelRef.current) {
      modelRef.current.explode();
      setShowScreen(false);
    }
  }, [jackpotTriggered]);

  const handlePennyWin = () => {
    console.log('UnifiedSlotScene: handlePennyWin called');
    setPennyWinTriggered(true);
    if (onPennyWin) onPennyWin();
  };

  const handlePigJackpot = () => {
    console.log('UnifiedSlotScene: handlePigJackpot called');
    setJackpotTriggered(true);
    if (onPigJackpot) onPigJackpot();
  };

  return (
    <>
      {/* Shared Background */}
      <BackgroundPlane />

      {/* Shared Lighting */}
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

      {/* Ground shadow plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 1]}
        position={[0, -0.8, 0]}
        receiveShadow
      >
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Bottom cloud layer */}
      <BottomClouds />

      {/* Ambient sparkle particles */}
      <AmbientParticles />

      {/* PIGGY PHASE: Show piggy bank with drag-to-rotate */}
      {phase === 'piggy' && (
        <group rotation={[0, piggyRotation, 0]}>
          <Float floatIntensity={0} speed={0} position={[0, -0.8, 0]}>
            <PiggyBank
              scale={0.9}
              setIsBroken={handlePiggyBroken}
              initialBroken={false}
              onCoinClick={handleCoinClick}
            />
          </Float>
        </group>
      )}

      {/* SLOT MACHINE PHASE: Show slot machine */}
      {phase === 'slot-machine' && !pennyWinTriggered && (
        <group ref={groupRef} position={[0, -10, 0]}>
          {/* Slot Machine Model */}
          <Model
            ref={modelRef}
            position={[0, 0, 2.5]}
            scale={1}
            rotation={[0.2, 0, 0]}
            castShadow
            receiveShadow
          />

          {/* TV Screen with slot game */}
          {showScreen && (
            <TVScreenInGap
              onPennyWin={handlePennyWin}
              onPigJackpot={handlePigJackpot}
            />
          )}
        </group>
      )}

      {/* Camera Controls - rotation disabled to prevent cloud issues */}
      {/* Piggy rotation is handled by drag-to-rotate on the piggy group */}
      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
      />
    </>
  );
};

export default UnifiedSlotScene;
