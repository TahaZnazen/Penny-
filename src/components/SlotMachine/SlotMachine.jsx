import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import { Model } from '../SlotMachineModel';
import TVScreen from '../TVScreen';
import SlotGame from '../SlotGame';
import './SlotMachine.css';

const SlotMachineScene = () => {
  // GUI Controls for debugging position and scale
  // const { positionX, positionY, positionZ, scale, rotation } = useControls('Slot Machine', {
  //   positionX: { value: 0, min: -10, max: 10, step: 0.1, label: 'Position X' },
  //   positionY: { value: 0, min: -10, max: 10, step: 0.1, label: 'Position Y' },
  //   positionZ: { value: 0, min: -10, max: 10, step: 0.1, label: 'Position Z' },
  //   scale: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Scale' },
  //   rotation: { value: 0, min: 0, max: Math.PI * 2, step: 0.1, label: 'Rotation Y' },
  // });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Slot Machine Model - Controlled by GUI */}
      <Model
        position={[0, 0, 2.5]}
        scale={1}
        rotation={[0, 0, 0]}
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

const SlotMachine = () => {
  const navigate = useNavigate();

  return (
    <div className="slot-machine-container">
      <button
        className="back-home-button"
        onClick={() => navigate('/')}
      >
        ← Back
      </button>

      {/* 3D Slot Machine Model */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <SlotMachineScene />
      </Canvas>

      {/* TVScreen with game (will be integrated into 3D model later) */}
      <TVScreen>
        <SlotGame />
      </TVScreen>
    </div>
  );
};

export default SlotMachine;
