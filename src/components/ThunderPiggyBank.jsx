import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { audioManager } from "../utils/audioManager";

// Individual mesh piece component - NO CLICK functionality
const ThunderPiggyPiece = ({
  geometry,
  material,
  position,
  isBroken,
}) => {
  const meshRef = useRef();
  const [localPos] = useState(new THREE.Vector3(...position));
  const [velocity] = useState(
    new THREE.Vector3(
      (Math.random() - 0.5) * 0.15,
      0.1 + Math.random() * 0.1, // Initial upward burst
      (Math.random() - 0.5) * 0.15
    )
  );
  const [rotationVel] = useState(
    new THREE.Vector3(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3
    )
  );

  useFrame(() => {
    if (meshRef.current && isBroken) {
      // Apply physics to broken pieces
      localPos.add(velocity);
      velocity.y -= 0.003; // gravity

      meshRef.current.position.copy(localPos);
      meshRef.current.rotation.x += rotationVel.x;
      meshRef.current.rotation.y += rotationVel.y;
      meshRef.current.rotation.z += rotationVel.z;
    }
  });

  // Remove piece if it falls too far
  if (isBroken && localPos.y < -10) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
    />
  );
};

useGLTF.preload("/models/piggybank.glb");

// Thunder scene PiggyBank - controlled breaking, no click
export const ThunderPiggyBank = ({ shouldBreak = false, onBroken, ...props }) => {
  const { nodes, materials } = useGLTF("/models/piggybank.glb");
  const [isBroken, setIsBroken] = useState(false);
  const groupRef = useRef();
  const hasTriggeredBreak = useRef(false);
  const brokenCallbackFired = useRef(false);

  // Array of all mesh data from GLTF
  const meshes = [
    { node: nodes.Mesh_0_cell, position: [-0.259, -0.196, -0.424] },
    { node: nodes.Mesh_0_cell001, position: [0.337, 0.21, 0.04] },
    { node: nodes.Mesh_0_cell002, position: [0.289, 0.215, 0.392] },
    { node: nodes.Mesh_0_cell003, position: [-0.019, 0.151, -0.698] },
    { node: nodes.Mesh_0_cell004, position: [0.323, 0.306, 0.335] },
    { node: nodes.Mesh_0_cell005, position: [-0.31, 0.179, -0.256] },
    { node: nodes.Mesh_0_cell006, position: [-0.21, 0.132, 0.674] },
    { node: nodes.Mesh_0_cell007, position: [-0.082, 0.002, 0.909] },
    { node: nodes.Mesh_0_cell008, position: [-0.34, -0.088, -0.079] },
    { node: nodes.Mesh_0_cell009, position: [-0.241, 0.307, 0.208] },
    { node: nodes.Mesh_0_cell010, position: [-0.129, 0.069, 0.858] },
    { node: nodes.Mesh_0_cell011, position: [-0.011, 0.108, -0.891] },
    { node: nodes.Mesh_0_cell012, position: [-0.262, -0.162, -0.249] },
    { node: nodes.Mesh_0_cell013, position: [0.207, -0.209, -0.252] },
    { node: nodes.Mesh_0_cell014, position: [-0.315, -0.116, 0.215] },
    { node: nodes.Mesh_0_cell015, position: [-0.235, -0.108, -0.46] },
    { node: nodes.Mesh_0_cell016, position: [0.042, 0.097, -0.819] },
    { node: nodes.Mesh_0_cell017, position: [-0.145, 0.347, -0.145] },
    { node: nodes.Mesh_0_cell018, position: [0.025, 0.292, 0.65] },
    { node: nodes.Mesh_0_cell019, position: [-0.125, -0.065, 0.76] },
    { node: nodes.Mesh_0_cell020, position: [0.068, -0.194, 0.346] },
    { node: nodes.Mesh_0_cell021, position: [0.273, 0.253, -0.214] },
    { node: nodes.Mesh_0_cell022, position: [-0.096, -0.181, 0.326] },
    { node: nodes.Mesh_0_cell023, position: [0.002, 0.198, -0.715] },
    { node: nodes.Mesh_0_cell024, position: [-0.127, -0.264, -0.28] },
    { node: nodes.Mesh_0_cell025, position: [0.147, 0.363, 0] },
    { node: nodes.Mesh_0_cell026, position: [-0.153, -0.267, 0.179] },
    { node: nodes.Mesh_0_cell027, position: [-0.03, 0.198, -0.763] },
    { node: nodes.Mesh_0_cell028, position: [0.149, -0.127, 0.416] },
    { node: nodes.Mesh_0_cell029, position: [0.012, 0.108, -0.637] },
    { node: nodes.Mesh_0_cell030, position: [0.053, -0.054, 0.829] },
    { node: nodes.Mesh_0_cell031, position: [0.06, 0.17, -0.752] },
    { node: nodes.Mesh_0_cell032, position: [-0.356, 0.13, 0.022] },
    { node: nodes.Mesh_0_cell033, position: [-0.055, -0.174, 0.435] },
    { node: nodes.Mesh_0_cell034, position: [-0.007, -0.238, 0.228] },
    { node: nodes.Mesh_0_cell035, position: [-0.202, 0.25, 0.621] },
    { node: nodes.Mesh_0_cell036, position: [-0.2, -0.227, 0.293] },
    { node: nodes.Mesh_0_cell037, position: [0.252, -0.108, 0.291] },
    { node: nodes.Mesh_0_cell038, position: [-0.229, -0.31, -0.388] },
    { node: nodes.Mesh_0_cell039, position: [0.248, -0.244, -0.377] },
    { node: nodes.Mesh_0_cell040, position: [0.282, -0.146, -0.173] },
    { node: nodes.Mesh_0_cell041, position: [0.326, 0.091, 0.198] },
    { node: nodes.Mesh_0_cell042, position: [-0.163, -0.013, 0.719] },
    { node: nodes.Mesh_0_cell043, position: [0.115, -0.372, -0.407] },
    { node: nodes.Mesh_0_cell044, position: [0.069, 0.014, 0.921] },
    { node: nodes.Mesh_0_cell045, position: [0.022, 0.161, -0.83] },
    { node: nodes.Mesh_0_cell046, position: [0.053, 0.12, 0.903] },
    { node: nodes.Mesh_0_cell047, position: [-0.294, 0.227, 0.335] },
    { node: nodes.Mesh_0_cell048, position: [-0.216, -0.233, -0.005] },
    { node: nodes.Mesh_0_cell049, position: [-0.155, -0.124, 0.517] },
    { node: nodes.Mesh_0_cell050, position: [0.007, 0.1, 0.01] },
    { node: nodes.Mesh_0_cell051, position: [0.139, -0.289, -0.503] },
    { node: nodes.Mesh_0_cell052, position: [-0.312, 0.221, 0.467] },
    { node: nodes.Mesh_0_cell053, position: [-0.325, 0.352, 0.338] },
    { node: nodes.Mesh_0_cell054, position: [-0.189, -0.218, -0.504] },
    { node: nodes.Mesh_0_cell055, position: [-0.026, 0.166, -0.878] },
    { node: nodes.Mesh_0_cell056, position: [-0.217, -0.075, 0.591] },
    { node: nodes.Mesh_0_cell057, position: [-0.12, 0.227, 0.706] },
    { node: nodes.Mesh_0_cell058, position: [-0.283, 0.07, -0.377] },
    { node: nodes.Mesh_0_cell059, position: [0.05, -0.293, 0.028] },
    { node: nodes.Mesh_0_cell060, position: [-0.092, 0.383, 0.434] },
    { node: nodes.Mesh_0_cell061, position: [-0.318, 0.111, 0.22] },
    { node: nodes.Mesh_0_cell062, position: [-0.146, -0.383, -0.356] },
    { node: nodes.Mesh_0_cell063, position: [-0.28, -0.37, 0.3] },
    { node: nodes.Mesh_0_cell064, position: [0.216, -0.243, -0.512] },
    { node: nodes.Mesh_0_cell065, position: [-0.306, 0.396, 0.384] },
    { node: nodes.Mesh_0_cell066, position: [0.199, -0.051, -0.486] },
    { node: nodes.Mesh_0_cell067, position: [0.196, -0.4, -0.362] },
    { node: nodes.Mesh_0_cell068, position: [0.145, -0.132, 0.623] },
    { node: nodes.Mesh_0_cell069, position: [-0.197, -0.402, -0.449] },
    { node: nodes.Mesh_0_cell070, position: [-0.087, 0.047, -0.539] },
    { node: nodes.Mesh_0_cell071, position: [0.081, 0.316, -0.375] },
    { node: nodes.Mesh_0_cell072, position: [0.307, 0.28, -0.079] },
    { node: nodes.Mesh_0_cell073, position: [0.271, 0.141, -0.389] },
    { node: nodes.Mesh_0_cell074, position: [-0.242, 0.319, 0.476] },
    { node: nodes.Mesh_0_cell075, position: [0.033, -0.172, 0.561] },
    { node: nodes.Mesh_0_cell076, position: [-0.239, 0.064, -0.474] },
    { node: nodes.Mesh_0_cell077, position: [-0.032, -0.171, -0.428] },
    { node: nodes.Mesh_0_cell078, position: [0.295, -0.16, 0.06] },
    { node: nodes.Mesh_0_cell079, position: [-0.301, -0.369, 0.2] },
    { node: nodes.Mesh_0_cell080, position: [-0.131, -0.139, 0.38] },
    { node: nodes.Mesh_0_cell081, position: [0.193, -0.401, -0.455] },
    { node: nodes.Mesh_0_cell082, position: [0.226, 0.369, 0.367] },
    { node: nodes.Mesh_0_cell083, position: [0.083, -0.17, -0.453] },
    { node: nodes.Mesh_0_cell084, position: [0.005, 0.368, 0.239] },
    { node: nodes.Mesh_0_cell085, position: [-0.203, -0.417, -0.372] },
    { node: nodes.Mesh_0_cell086, position: [-0.231, -0.095, 0.348] },
    { node: nodes.Mesh_0_cell087, position: [-0.294, 0.063, 0.389] },
    { node: nodes.Mesh_0_cell088, position: [0.271, -0.014, 0.431] },
    { node: nodes.Mesh_0_cell089, position: [-0.125, -0.372, -0.451] },
    { node: nodes.Mesh_0_cell090, position: [0.268, 0.171, 0.567] },
    { node: nodes.Mesh_0_cell091, position: [-0.265, -0.276, 0.164] },
    { node: nodes.Mesh_0_cell092, position: [-0.066, 0.136, 0.857] },
    { node: nodes.Mesh_0_cell093, position: [-0.24, 0.014, 0.647] },
    { node: nodes.Mesh_0_cell094, position: [0.176, 0.036, 0.715] },
    { node: nodes.Mesh_0_cell095, position: [-0.136, -0.287, -0.483] },
    { node: nodes.Mesh_0_cell096, position: [-0.017, -0.12, 0.75] },
    { node: nodes.Mesh_0_cell097, position: [0.079, -0.266, -0.292] },
    { node: nodes.Mesh_0_cell098, position: [0.27, -0.323, 0.251] },
    { node: nodes.Mesh_0_cell099, position: [0.365, 0.021, 0.015] },
    { node: nodes.Mesh_0_cell100, position: [-0.06, 0.243, -0.509] },
    { node: nodes.Mesh_0_cell101, position: [-0.039, 0.07, -0.799] },
    { node: nodes.Mesh_0_cell102, position: [0.069, 0.395, -0.191] },
    { node: nodes.Mesh_0_cell103, position: [-0.062, 0.146, -0.795] },
  ];

  // Trigger break when shouldBreak becomes true
  useEffect(() => {
    if (shouldBreak && !hasTriggeredBreak.current) {
      hasTriggeredBreak.current = true;
      audioManager.playFinal();
      setIsBroken(true);

      // Call onBroken callback after explosion animation
      setTimeout(() => {
        if (onBroken && !brokenCallbackFired.current) {
          brokenCallbackFired.current = true;
          onBroken();
        }
      }, 1500);
    }
  }, [shouldBreak, onBroken]);

  const glowIntensity = isBroken ? 1 : 0;

  return (
    <group {...props} ref={groupRef} dispose={null}>
      {/* Golden glow when broken */}
      <pointLight
        position={[0, 0, 0]}
        intensity={glowIntensity * 20}
        color="#ffd700"
        distance={15}
      />

      {isBroken && (
        <pointLight
          position={[0, 0, 2]}
          intensity={glowIntensity * 10}
          color="#ffaa00"
          distance={8}
        />
      )}

      {/* All piggy bank pieces */}
      {meshes.map((mesh, i) => (
        <ThunderPiggyPiece
          key={i}
          geometry={mesh.node.geometry}
          material={materials.Material_0}
          position={mesh.position}
          isBroken={isBroken}
        />
      ))}

      {/* Golden coin revealed after break */}
      {isBroken && <ThunderCoin />}
    </group>
  );
};

// Golden coin that rises and scales after breaking
const ThunderCoin = () => {
  const coinRef = useRef();
  const [targetScale, setTargetScale] = useState(0);
  const [targetY, setTargetY] = useState(0);
  const currentY = useRef(0);
  const currentScale = useRef(0);

  useEffect(() => {
    // Start animation after a brief delay
    const timer = setTimeout(() => {
      setTargetScale(1.5); // Scale up to 1.5x
      setTargetY(2.5); // Rise up 2.5 units
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useFrame(() => {
    if (coinRef.current) {
      // Gentle rotation
      coinRef.current.rotation.y += 0.02;

      // Smooth scale animation
      currentScale.current += (targetScale - currentScale.current) * 0.05;
      coinRef.current.scale.setScalar(currentScale.current);

      // Smooth upward movement
      currentY.current += (targetY - currentY.current) * 0.03;
      coinRef.current.position.y = currentY.current;
    }
  });

  return (
    <group ref={coinRef} scale={0} position={[0, 0, 0]}>
      {/* Main coin */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.4}
          roughness={0.5}
          emissive="#ffaa00"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Glow */}
      <pointLight
        position={[0, 0, 0]}
        color="#ffd700"
        intensity={15}
        distance={8}
      />
    </group>
  );
};

export default ThunderPiggyBank;
