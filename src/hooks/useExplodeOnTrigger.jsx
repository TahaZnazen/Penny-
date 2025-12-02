import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Hook for triggering explosion animation on slot machine pieces
 * Perfect for jackpot wins!
 *
 * @param {Object} group - React ref to the group containing all meshes
 * @param {Object} options
 * @param {number} options.distance - How far pieces explode (default: 3)
 * @param {boolean} options.enableRotation - Whether pieces rotate during explosion (default: true)
 * @param {number} options.duration - Animation duration in seconds (default: 2)
 * @param {boolean} options.autoReset - Auto reset after animation completes (default: false)
 *
 * @returns {Object} { explode, reset, isExploding, progress }
 */
export const useExplodeOnTrigger = (
  group,
  {
    distance = 3,
    enableRotation = true,
    duration = 2,
    autoReset = false
  } = {}
) => {
  const [isExploding, setIsExploding] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationSpeed = useRef(1 / (duration * 60)); // Convert duration to frames (60fps)

  // Initialize: Store original positions and calculate direction vectors
  useEffect(() => {
    if (!group.current) return;

    const groupWorldPosition = new THREE.Vector3();
    group.current.getWorldPosition(groupWorldPosition);

    group.current.children.forEach((mesh) => {
      // Store original position and rotation
      mesh.originalPosition = mesh.position.clone();
      mesh.originalRotation = mesh.rotation.clone();

      // Set initial visibility: only show origin, hide cells
      if (mesh.name === "origin") {
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }

      // Calculate direction from center to this piece
      const meshWorldPosition = new THREE.Vector3();
      mesh.getWorldPosition(meshWorldPosition);
      mesh.directionVector = meshWorldPosition
        .clone()
        .sub(groupWorldPosition)
        .normalize();

      // Generate random target rotation for spinning effect
      mesh.targetRotation = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
    });
  }, []);

  // Update target positions when distance changes
  useEffect(() => {
    if (!group.current) return;

    group.current.children.forEach((mesh) => {
      if (mesh.originalPosition && mesh.directionVector) {
        mesh.targetPosition = mesh.originalPosition
          .clone()
          .add(mesh.directionVector.clone().multiplyScalar(distance));
      }
    });
  }, [distance]);

  // Animation loop
  useFrame(() => {
    if (!group.current) return;

    // Update progress if exploding
    if (isExploding) {
      setProgress((prev) => {
        const newProgress = Math.min(prev + animationSpeed.current, 1);

        // Auto-reset if enabled and animation complete
        if (newProgress >= 1 && autoReset) {
          setTimeout(() => {
            setIsExploding(false);
            setProgress(0);
          }, 500); // Small delay before reset
        }

        return newProgress;
      });
    }

    // Animate each piece
    group.current.children.forEach((mesh) => {
      // Toggle visibility: origin visible when NOT exploding, cells visible when exploding
      if (mesh.name === "origin") {
        mesh.visible = !isExploding;
      } else {
        // Cell pieces only visible during explosion
        mesh.visible = isExploding;
      }

      // Only animate if we have targets
      if (!mesh.originalPosition || !mesh.targetPosition || !isExploding) return;

      // Smooth easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      // Interpolate position
      mesh.position.x = THREE.MathUtils.lerp(
        mesh.originalPosition.x,
        mesh.targetPosition.x,
        eased
      );
      mesh.position.y = THREE.MathUtils.lerp(
        mesh.originalPosition.y,
        mesh.targetPosition.y,
        eased
      );
      mesh.position.z = THREE.MathUtils.lerp(
        mesh.originalPosition.z,
        mesh.targetPosition.z,
        eased
      );

      // Interpolate rotation if enabled
      if (enableRotation && mesh.originalRotation && mesh.targetRotation) {
        mesh.rotation.x = THREE.MathUtils.lerp(
          mesh.originalRotation.x,
          mesh.targetRotation.x,
          eased
        );
        mesh.rotation.y = THREE.MathUtils.lerp(
          mesh.originalRotation.y,
          mesh.targetRotation.y,
          eased
        );
        mesh.rotation.z = THREE.MathUtils.lerp(
          mesh.originalRotation.z,
          mesh.targetRotation.z,
          eased
        );
      }
    });
  });

  // Trigger explosion
  const explode = () => {
    setIsExploding(true);
    setProgress(0);
  };

  // Reset to original state
  const reset = () => {
    setIsExploding(false);
    setProgress(0);

    if (group.current) {
      group.current.children.forEach((mesh) => {
        if (mesh.originalPosition) {
          mesh.position.copy(mesh.originalPosition);
        }
        if (mesh.originalRotation) {
          mesh.rotation.copy(mesh.originalRotation);
        }
        // Show origin mesh again, hide cells
        if (mesh.name === "origin") {
          mesh.visible = true;
        }
      });
    }
  };

  return {
    explode,    // Function to trigger explosion
    reset,      // Function to reset to original state
    isExploding, // Boolean: is animation playing
    progress    // Number 0-1: animation progress
  };
};
