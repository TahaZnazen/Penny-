import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect } from "react";
import { PiggyBank } from "./PiggyBank";
import { useThree } from "@react-three/fiber";

export const Experience = ({ setIsbroken, isBroken }) => {
  const backgroundTexture = useTexture("/textures/bg.png");
  const { viewport } = useThree();

  backgroundTexture.colorSpace = THREE.SRGBColorSpace;
  // Change to ClampToEdgeWrapping to prevent repeating
  backgroundTexture.wrapS = THREE.ClampToEdgeWrapping;
  backgroundTexture.wrapT = THREE.ClampToEdgeWrapping;

  useEffect(() => {
    if (!backgroundTexture.image) return;

    const imageAspect = backgroundTexture.image.width / backgroundTexture.image.height;
    const viewportAspect = viewport.aspect;

    if (viewportAspect > imageAspect) {
      // Viewport is wider - zoom in to cover width
      const scale = imageAspect / viewportAspect;
      backgroundTexture.repeat.set(1, scale);
      backgroundTexture.offset.set(0, (1 - scale) / 2);
    } else {
      // Viewport is taller - zoom in to cover height
      const scale = viewportAspect / imageAspect;
      backgroundTexture.repeat.set(scale, 1);
      backgroundTexture.offset.set((1 - scale) / 2, 0);
    }
  }, [backgroundTexture, viewport.aspect]);

  return (
    <>
      <primitive attach="background" object={backgroundTexture} />
      
      <OrbitControls
        enableZoom={false}
        minDistance={3}
        maxDistance={10}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
      
      <Float floatIntensity={0} speed={0} position={[0, -0.8, 0]}>
        <PiggyBank scale={0.9} setIsbroken={setIsbroken} initialBroken={isBroken} />
      </Float>
      
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.4}
        scale={3}
        blur={3}
        far={6}
        resolution={256}
        color="#000000"
      />
      
      <Environment preset="sunset" background={false} blur={0} />
      <ambientLight intensity={0.7} />
      
      <hemisphereLight
        skyColor="#ffd4e5"
        groundColor="#9370db"
        intensity={0.8}
      />
    </>
  );
};