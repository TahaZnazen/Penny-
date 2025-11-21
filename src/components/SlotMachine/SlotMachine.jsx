import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useControls } from 'leva';
import { Model } from '../SlotMachineModel';
import TVScreen from '../TVScreen';
import SlotGame from '../SlotGame';
import './SlotMachine.css';

// Screen Component - Embeds HTML SlotGame in 3D space
const ScreenInGap = () => {
  // const {
  //   screenX,
  //   screenY,
  //   screenZ,
  //   screenScale,
  //   screenRotationY
  // } = useControls('Screen Position', {
  //   screenX: { value: 0, min: -5, max: 5, step: 0.01, label: 'Screen X' },
  //   screenY: { value: 0, min: -5, max: 5, step: 0.01, label: 'Screen Y' },
  //   screenZ: { value: 0, min: -5, max: 5, step: 0.01, label: 'Screen Z' },
  //   screenScale: { value: 0.35, min: 0.01, max: 2, step: 0.01, label: 'Scale' },
  //   screenRotationY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotation Y' },
  // });

  return (
    <group
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={0.7 }
    >
      <Html
        transform
        occlude="blending"
        position={[0, 0.07, 0]}
        distanceFactor={1}
        style={{
          width: '1550px',
          height: '800px',
          pointerEvents: 'auto',
        }}
        wrapperClass="screen-wrapper"
      >
        <TVScreen>
          <SlotGame />
        </TVScreen>
      </Html>
    </group>
  );
};

const SlotMachineScene = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Slot Machine Model */}


      {/* Screen with SlotGame embedded in 3D space */}
    
      <ScreenInGap />
      <Model
        position={[0, 0, 2.5]}
        scale={1}
        rotation={[0.2, 0, 0]}
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

      {/* 3D Slot Machine Model with integrated screen */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <SlotMachineScene />
      </Canvas>
          {/* <TVScreen>
          <SlotGame />
        </TVScreen> */}
    </div>
  );
};

export default SlotMachine;
