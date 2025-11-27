import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress, Preload } from "@react-three/drei";
import Home from "./components/Home";
import SlotMachine from "./components/SlotMachine";
import ThunderEffect from "./components/ThunderEffect/ThunderEffect";
import MinimalLoader from "./components/loader/MinimalLoader";
import ThunderLoader from "./components/ThunderLoader/ThunderLoader";
import { audioManager } from "./utils/audioManager";

function AssetsTracker({ onReady }) {
  const { active, progress } = useProgress();

  useEffect(() => {
    if (!active && progress === 100) {
      onReady();
    }
  }, [active, progress, onReady]);

  return null;
}

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [hasStartedExperience, setHasStartedExperience] = useState(false);
  const [hasCompletedThunder, setHasCompletedThunder] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAssetsReady = () => {
    setAssetsLoaded(true);
  };

  const handleStartExperience = () => {
    // Start audio
    audioManager.playBackgroundMusic();

    // Transition to thunder scene
    setIsTransitioning(true);

    setTimeout(() => {
      setHasStartedExperience(true);
      setIsTransitioning(false);
    }, 1000); // Match fade-out duration
  };

  const handleThunderComplete = () => {
    setHasCompletedThunder(true);
  };

  return (
    <Router>
      {/* Step 1: Minimal Loader - Shows while assets loading, then shows "Start Experience" button */}
      {!hasStartedExperience && (
        <MinimalLoader
          assetsLoaded={assetsLoaded}
          onStart={handleStartExperience}
          isTransitioning={isTransitioning}
        />
      )}

      {/* Step 2: Thunder Scene - Interactive 5-scroll experience */}
      {hasStartedExperience && !hasCompletedThunder && (
        <ThunderLoader onComplete={handleThunderComplete} />
      )}

      {/* Hidden Canvas for preloading assets */}
      <Canvas style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1 }}>
        <Preload all />
        <AssetsTracker onReady={handleAssetsReady} />
      </Canvas>

      {/* Step 3: Routes - Main application */}
      {hasCompletedThunder && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/slot-machine" element={<SlotMachine />} />
          <Route path="/thunder-effect" element={<ThunderEffect />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
