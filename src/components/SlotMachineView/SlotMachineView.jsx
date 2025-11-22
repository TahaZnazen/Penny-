import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model } from '../SlotMachineModel';
import TVScreenInGap from '../TVScreenInGap/TVScreenInGap';
import JackpotScreen from '../JackpotScreen/JackpotScreen';
import './SlotMachineView.css';

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
        {/* <planeGeometry args={[25, 50]} /> */}
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Screen with SlotGame embedded in 3D space - hidden during explosion */}
      {showScreen && <TVScreenInGap onJackpot={handleJackpot} />}

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

const SlotMachineView = () => {
  const [showJackpotScreen, setShowJackpotScreen] = React.useState(false);

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
        <SlotMachineScene onJackpot={handleJackpot} />
      </Canvas>
    </div>
  );
};

export default SlotMachineView;
