import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
import { ThunderPiggyBank } from '../../components/ThunderPiggyBank';
import { audioManager } from '../../utils/audioManager';
import * as THREE from 'three';
import './ThunderEffect.css';

// Lightning bolt visual component - creates branching lightning
const LightningBolt = ({ startPos, endPos, active, intensity = 1 }) => {
  const lineRef = useRef();
  const [points, setPoints] = useState([]);

  // Generate jagged lightning path
  const generateLightningPath = useMemo(() => {
    return () => {
      const pts = [];
      const segments = 8;
      const start = new THREE.Vector3(...startPos);
      const end = new THREE.Vector3(...endPos);

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const pos = new THREE.Vector3().lerpVectors(start, end, t);

        // Add random offset for jagged effect (except start and end)
        if (i > 0 && i < segments) {
          pos.x += (Math.random() - 0.5) * 2;
          pos.z += (Math.random() - 0.5) * 1;
        }
        pts.push(pos);
      }
      return pts;
    };
  }, [startPos, endPos]);

  useEffect(() => {
    if (active) {
      setPoints(generateLightningPath());
    }
  }, [active, generateLightningPath]);

  useFrame(() => {
    if (lineRef.current && active) {
      // Flicker effect
      lineRef.current.material.opacity = 0.5 + Math.random() * 0.5;
    }
  });

  if (!active || points.length === 0) return null;

  return (
    <group>
      {/* Main bolt */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#a0c4ff"
          transparent
          opacity={1}
          linewidth={3}
        />
      </line>

      {/* Glow effect */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          linewidth={6}
        />
      </line>

      {/* Point light at strike point */}
      <pointLight
        position={endPos}
        intensity={intensity * 150}
        color="#a0c4ff"
        distance={30}
        decay={2}
      />
    </group>
  );
};

// Storm clouds at the top
const StormClouds = () => {
  const cloudData = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (i - 4) * 4 + Math.random() * 2,
        8 + Math.random() * 2,
        -5 + Math.random() * 3
      ],
      speed: 0.1 + Math.random() * 0.1,
      opacity: 0.6 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <group>
      {cloudData.map((cloud, i) => (
        <Cloud
          key={i}
          position={cloud.position}
          speed={cloud.speed}
          opacity={cloud.opacity}
          color="#2c3e50"
          segments={40}
          bounds={[6, 2, 3]}
          volume={8}
          fade={30}
        />
      ))}
    </group>
  );
};

// Main Thunder Scene
const ThunderScene = ({ lightningActive, shouldBreakPiggy, onPiggyBroken }) => {
  const lightRef = useRef();

  // Flash light on lightning
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = lightningActive ? 5 + Math.random() * 5 : 0.3;
    }
  });

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.1} />

      {/* Flash light */}
      <directionalLight
        ref={lightRef}
        position={[0, 10, 5]}
        intensity={0.3}
        color="#a0c4ff"
      />

      {/* Storm clouds at top */}
      <Suspense fallback={null}>
        <StormClouds />
      </Suspense>

      {/* Lightning bolts - strike center bottom */}
      <LightningBolt
        startPos={[-2, 7, 0]}
        endPos={[0, -2, 0]}
        active={lightningActive}
        intensity={1}
      />
      <LightningBolt
        startPos={[2, 8, -1]}
        endPos={[0, -2, 0]}
        active={lightningActive}
        intensity={0.7}
      />

      {/* ThunderPiggyBank - breaks after 5 scrolls, no click */}
      <Suspense fallback={null}>
        <ThunderPiggyBank
          position={[0, -3, 0]}
          scale={2.5}
          shouldBreak={shouldBreakPiggy}
          onBroken={onPiggyBroken}
        />
      </Suspense>
    </>
  );
};

const ThunderEffect = ({
  onScrollComplete = null,
  useNavigation = true
}) => {
  const navigate = useNavigation ? useNavigate() : null;
  const { isLoaded, loadingProgress } = useLoading();
  const [lightningActive, setLightningActive] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [shouldBreakPiggy, setShouldBreakPiggy] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);

  // Play rain ambient on mount, stop on unmount
  useEffect(() => {
    audioManager.playRain();
    return () => {
      audioManager.stopRain();
    };
  }, []);

  // Trigger lightning on scroll
  const triggerLightning = () => {
    setLightningActive(true);
    audioManager.playThunder();
    setTimeout(() => setLightningActive(false), 150);
  };

  // Handle piggy broken callback - show start button
  const handlePiggyBroken = () => {
    setShowStartButton(true);
  };

  // Handle Start Experience button click
  const handleStartExperience = (e) => {
    e.stopPropagation(); // Prevent triggering container click
    audioManager.playChill();
    if (onScrollComplete) {
      onScrollComplete();
    } else if (useNavigation && navigate) {
      navigate('/home');
    }
  };

  // Handle click event
  const handleClick = () => {
    triggerLightning();

    // Only count clicks after assets loaded and piggy not yet broken
    if (!isLoaded || shouldBreakPiggy) return;

    setScrollCount(prev => {
      const newCount = prev + 1;

      // Break piggy on 5th click
      if (newCount >= 5 && !shouldBreakPiggy) {
        triggerLightning();
        setShouldBreakPiggy(true);
      }

      return Math.min(newCount, 5);
    });
  };

  // Display text
  const getDisplayText = () => {
    if (!isLoaded) return `Loading... ${loadingProgress}%`;
    if (showStartButton) return '';
    return `⚡ Tap anywhere to strike! (${scrollCount}/5)`;
  };

  return (
    <div className="thunder-effect-container" onClick={handleClick}>
      {/* CSS Rain overlay */}
      <div className="rain-container">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="rain-drop" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${0.5 + Math.random() * 0.3}s`,
            animationDelay: `${Math.random() * 2}s`,
          }} />
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true }}
        
      >
        <ThunderScene
          lightningActive={lightningActive}
          shouldBreakPiggy={shouldBreakPiggy}
          onPiggyBroken={handlePiggyBroken}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="thunder-controls">
        {!showStartButton && (
          <>
            <div className="scroll-counter">
              {getDisplayText()}
            </div>
            {!isLoaded && (
              <div className="loading-bar">
                <div
                  className="loading-bar-fill"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            )}
          </>
        )}

        {/* Start Experience Button - appears after piggy breaks */}
        {showStartButton && (
          <button
            className="start-experience-button"
            onClick={handleStartExperience}
          >
            Start Experience
          </button>
        )}
      </div>
    </div>
  );
};

export default ThunderEffect;
