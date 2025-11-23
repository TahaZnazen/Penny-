import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress, Preload } from "@react-three/drei";
import Home from "./components/Home";
import SlotMachine from "./components/SlotMachine";
import ThunderEffect from "./components/ThunderEffect/ThunderEffect";
import { LoadingScreen } from "./components/loader/LoadingScreen";
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
  const [hasStarted, setHasStarted] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    audioManager.playChill();
    setIsTransitioning(true);

    setTimeout(() => {
      setHasStarted(true);
      setIsTransitioning(false);
    }, 1500);
  };

  const handleAssetsReady = () => {
    setAssetsLoaded(true);
  };

  return (
    <Router>
      {/* Global Loading Screen - only shows once */}
      <LoadingScreen
        isLoading={!hasStarted}
        onStart={handleStart}
        assetsLoaded={assetsLoaded}
        isTransitioning={isTransitioning}
      />

      {/* Hidden Canvas for preloading assets */}
      <Canvas style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1 }}>
        <Preload all />
        <AssetsTracker onReady={handleAssetsReady} />
      </Canvas>

      {/* Routes */}
      {hasStarted && (
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
