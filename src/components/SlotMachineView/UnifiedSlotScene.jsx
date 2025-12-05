import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import { PiggyBank } from '../PiggyBank';
import { Model } from '../SlotMachineModel2';
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
  const [jackpotTriggered, setJackpotTriggered] = React.useState(false);
  const [pennyWinTriggered, setPennyWinTriggered] = React.useState(false);
  const [showScreen, setShowScreen] = React.useState(true);
  const [piggyBroken, setPiggyBroken] = React.useState(false);

  // Transition animation state
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [showSlotMachine, setShowSlotMachine] = React.useState(false);
  const slotPositionY = React.useRef(10); // Start off-screen
  const velocityY = React.useRef(0); // Velocity for spring physics

  // Set initial position when group mounts to avoid flash
  React.useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.y = slotPositionY.current;
    }
  }, [isTransitioning, showSlotMachine]);

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

  // Animation for slot machine position using spring physics
  useFrame(() => {
    if (!groupRef.current) return;

    // Target position based on state
    const targetY = showSlotMachine ? 0 : 10;

    if (isTransitioning) {
      // Spring physics parameters
      const stiffness = 120; // How strong the spring pulls (higher = faster)
      const damping = 14;    // How much friction/resistance (higher = less bounce)
      const mass = 1;        // Mass of the object
      const dt = 1 / 60;     // Fixed timestep for consistent physics

      // Calculate spring force: F = -k * displacement
      const displacement = slotPositionY.current - targetY;
      const springForce = -stiffness * displacement;

      // Calculate damping force: F = -c * velocity
      const dampingForce = -damping * velocityY.current;

      // Total acceleration: a = F / m
      const acceleration = (springForce + dampingForce) / mass;

      // Update velocity and position (semi-implicit Euler)
      velocityY.current += acceleration * dt;
      slotPositionY.current += velocityY.current * dt;

      // Check if animation is settled (position close to target AND velocity near zero)
      const isSettled = Math.abs(displacement) < 0.01 && Math.abs(velocityY.current) < 0.01;

      if (isSettled) {
        slotPositionY.current = targetY;
        velocityY.current = 0;
        setIsTransitioning(false);
        if (onPhaseChange) {
          onPhaseChange('slot-machine');
        }
      }
    } else if (phase === 'slot-machine') {
      // Keep at final position
      slotPositionY.current = 0;
    }

    // Apply position
    groupRef.current.position.y = slotPositionY.current;
  });

  // Handle piggy bank broken state
  const handlePiggyBroken = (broken) => {
    setPiggyBroken(broken);
  };

  // Handle coin click - start transition animation
  const handleCoinClick = () => {
    console.log('Coin clicked! Starting transition...');
    setShowSlotMachine(true);
    setIsTransitioning(true);
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

      {/* Front light for slot machine */}
      <spotLight
        position={[0, 2, 6]}
        angle={0.5}
        penumbra={0.5}
        intensity={1.5}
        color="#ffffff"
        target-position={[0, 0, 2.5]}
      />

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
      {phase === 'piggy' && !isTransitioning && (
        <>
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

          {/* Instruction to break piggy bank */}
          {!piggyBroken && (
            <Html center position={[0, 0.8, 0]} style={{ pointerEvents: 'none' }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '12px 24px',
                borderRadius: '12px',
                border: '2px solid #ffd700',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                <p style={{
                  color: '#ffd700',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: 0,
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                  whiteSpace: 'nowrap',
                }}>
                    Break the Piggy Bank!  
                </p>
              </div>
              <style>{`
                @keyframes pulse {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.05); opacity: 0.9; }
                }
              `}</style>
            </Html>
          )}

          {/* Instruction to click penny after piggy breaks */}
          {piggyBroken && (
            <Html center position={[0, 1.5, 0]} style={{ pointerEvents: 'none' }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '12px 24px',
                borderRadius: '12px',
                border: '2px solid #ffd700',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                <p style={{
                  color: '#ffd700',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: 0,
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                  whiteSpace: 'nowrap',
                }}>
                  ✨ Click the Penny! ✨
                </p>
              </div>
              <style>{`
                @keyframes pulse {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.05); opacity: 0.9; }
                }
              `}</style>
            </Html>
          )}
        </>
      )}

      {/* SLOT MACHINE: Shown during transition (dropping) and slot-machine phase */}
      {(isTransitioning || (phase === 'slot-machine' && !pennyWinTriggered)) && (
        <group ref={groupRef}>
          <Model
            ref={modelRef}
            position={[0, 0, 2.5]}
            scale={1.45}
            rotation={[0.2, 0, 0]}
            castShadow
            receiveShadow
          />
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
