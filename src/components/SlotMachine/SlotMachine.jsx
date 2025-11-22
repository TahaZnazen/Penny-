import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Model } from '../SlotMachineModel';
import TVScreen from '../TVScreen/TVScreen';
import SlotGame from '../SlotGame/SlotGame';
import JackpotScreen from '../JackpotScreen/JackpotScreen';
import './SlotMachine.css';

// Screen Component - Embeds HTML SlotGame in 3D space
const ScreenInGap = ({ onJackpot }) => {
  const [gameStarted, setGameStarted] = React.useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <group
      position={[0, 0, -0.2]}
      rotation={[0, 0, 0]}
      scale={0.7}
    >
      <Html
        transform
        occlude="blending"
        position={[0, 0.07, 0]}
        distanceFactor={1}
        style={{
          width: '1600px',
          height: '850px',
          pointerEvents: 'auto',
        }}
      >
        {!gameStarted ? (
          // Step 1: Show big SPIN button
          <div className="start-screen">
            <button className="big-spin-button" onClick={handleStartGame}>
              SPIN
            </button>
          </div>
        ) : (
          // Step 2: Show game and auto-start spinning
          <TVScreen>
            <SlotGame autoStart={true} onJackpot={onJackpot} />
          </TVScreen>
        )}
      </Html>
    </group>
  );
};

const SlotMachineScene = ({ onJackpot }) => {
  const modelRef = React.useRef();
  const [jackpotTriggered, setJackpotTriggered] = React.useState(false);
  const [showScreen, setShowScreen] = React.useState(true);

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
        <planeGeometry args={[25, 50]} />
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Screen with SlotGame embedded in 3D space - hidden during explosion */}
      {showScreen && <ScreenInGap onJackpot={handleJackpot} />}

      {/* Slot Machine Model with explosion capability */}
      <Model
        ref={modelRef}
        position={[0, 0, 2.5]}
        scale={1}
        rotation={[0.2, 0, 0]}
        castShadow
        receiveShadow
      />

      {/* Camera Controls - Disabled zoom and rotation */}
      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
      />
    </>
  );
};

const SlotMachine = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const [showJackpotScreen, setShowJackpotScreen] = React.useState(false);

  const handleJackpot = () => {
    setShowJackpotScreen(true);

    // Hide jackpot screen after 4 seconds
    // setTimeout(() => {
    //   setShowJackpotScreen(false);
    // }, 4000);
  };

  const handleBackClick = () => {
    console.log('Back button clicked! isEmbedded:', isEmbedded);
    if (isEmbedded) {
      // Scroll to top when embedded in Home page
      console.log('Scrolling to top...');
      // Try multiple scroll methods to ensure it works
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      // Navigate to home when standalone
      console.log('Navigating to home...');
      navigate('/');
    }
  };

  return (
    <div className="slot-machine-container">
      <button
        className="back-home-button"
        onClick={handleBackClick}
      >
        {isEmbedded ? '↑ Back to Top' : '← Back'}
      </button>

      {/* Jackpot Win Screen Overlay */}
      <JackpotScreen show={showJackpotScreen} />

      {/* 3D Slot Machine Model with integrated screen */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <SlotMachineScene onJackpot={handleJackpot} />
      </Canvas>
    </div>
  );
};

export default SlotMachine;
