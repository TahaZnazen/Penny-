import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model } from '../SlotMachineModel';
import TVScreenInGap from '../TVScreenInGap/TVScreenInGap';
import JackpotScreen from '../JackpotScreen/JackpotScreen';
import WinPennyScreen from '../WinPennyScreen/WinPennyScreen';
import BackgroundPlane from './BackgroundPlane';
import BottomClouds from './BottomClouds';
import AmbientParticles from './AmbientParticles';
import SlotGameContent, { useSlotGameState } from '../SlotGameContent';
import './SlotMachineView.css';

// Hook to detect mobile
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const SlotMachineScene = ({ onPennyWin, onPigJackpot, introComplete }) => {
  const modelRef = React.useRef();
  const groupRef = React.useRef();
  const [jackpotTriggered, setJackpotTriggered] = React.useState(false);
  const [pennyWinTriggered, setPennyWinTriggered] = React.useState(false);
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

  // Trigger explosion when jackpot (pig) happens
  React.useEffect(() => {
    if (jackpotTriggered && modelRef.current) {
      modelRef.current.explode();
      setShowScreen(false); // Hide TV screen during explosion
    }
  }, [jackpotTriggered]);

  const handlePennyWin = () => {
    // Penny win - hide machine, no explosion
    console.log('SlotMachineScene: handlePennyWin called');
    setPennyWinTriggered(true);
    if (onPennyWin) onPennyWin();
  };

  const handlePigJackpot = () => {
    console.log('SlotMachineScene: handlePigJackpot called');
    setJackpotTriggered(true);
    // Trigger parent jackpot screen
    if (onPigJackpot) onPigJackpot();
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
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Bottom cloud layer - creates floating effect */}
      <BottomClouds />

      {/* Ambient sparkle particles throughout scene */}
      <AmbientParticles />

      {/* Animated group for machine and screen - they fly in together */}
      {/* Hide entire machine on penny win */}
      {!pennyWinTriggered && (
        <group ref={groupRef} position={[0, 0, 0]}>
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
          {showScreen && (
            <TVScreenInGap
              onPennyWin={handlePennyWin}
              onPigJackpot={handlePigJackpot}
            />
          )}
        </group>
      )}

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
  const [showPennyWinScreen, setShowPennyWinScreen] = React.useState(false);
  const [introComplete, setIntroComplete] = React.useState(false);
  const isMobile = useIsMobile();

  // Shared game state for mobile (desktop uses TVScreenInGap's own state)
  const mobileGameState = useSlotGameState({
    onPennyWin: () => {
      console.log('MobileView: handlePennyWin called');
      setShowPennyWinScreen(true);
    },
    onPigJackpot: () => {
      console.log('MobileView: handlePigJackpot called');
      setShowJackpotScreen(true);
    },
  });

  // Mark intro as complete after 3 seconds (only for desktop)
  React.useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setIntroComplete(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const handlePennyWin = () => {
    console.log('SlotMachineView: handlePennyWin called');
    setShowPennyWinScreen(true);
  };

  const handlePigJackpot = () => {
    console.log('SlotMachineView: handlePigJackpot called');
    setShowJackpotScreen(true);
  };

  return (
    <div className="slot-machine-view">
      {isMobile ? (
        /* Mobile: 2D game only, no 3D Canvas */
        <SlotGameContent
          gameState={mobileGameState.gameState}
          onStartGame={mobileGameState.handleStartGame}
          onPennyWin={mobileGameState.handlePennyWin}
          onPigJackpot={mobileGameState.handlePigJackpot}
          onLose={mobileGameState.handleLose}
          isMobile={true}
        />
      ) : (
        /* Desktop: Full 3D experience */
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <SlotMachineScene
            onPennyWin={handlePennyWin}
            onPigJackpot={handlePigJackpot}
            introComplete={introComplete}
          />
        </Canvas>
      )}

      {/* Jackpot Win Screen Overlay (all 5 pigs) */}
      <JackpotScreen show={showJackpotScreen} />

      {/* Penny Win Screen Overlay (all 5 pennies) */}
      <WinPennyScreen show={showPennyWinScreen} />
    </div>
  );
};

export default SlotMachineView;
