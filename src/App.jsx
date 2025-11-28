import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress, Preload } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./components/Home";
import SlotMachine from "./components/SlotMachine";
import ThunderEffect from "./components/ThunderEffect/ThunderEffect";
import MinimalLoader from "./components/loader/MinimalLoader";
import ThunderLoader from "./components/ThunderLoader/ThunderLoader";
import PageTransition from "./components/PageTransition/PageTransition";
import TransitionCurtain from "./components/TransitionCurtain/TransitionCurtain";
import PreloadThunderAssets from "./components/PreloadThunderAssets";
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

// Animated Routes component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/slot-machine"
          element={
            <PageTransition>
              <SlotMachine />
            </PageTransition>
          }
        />
        
      </Routes>
    </AnimatePresence>
  );
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
    }, 600); // Match curtain animation duration
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

      {/* Transition Curtain for MinimalLoader to ThunderLoader */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '-100vh' }}
            transition={{
              duration: 0.3,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 99999,
              backgroundImage: 'url(/textures/animation.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      {/* Hidden Canvas for preloading assets */}
      <Canvas style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1 }}>
        <Suspense fallback={null}>
          <PreloadThunderAssets />
        </Suspense>
        <Preload all />
        <AssetsTracker onReady={handleAssetsReady} />
      </Canvas>

      {/* Step 3: Routes - Main application */}
      {hasCompletedThunder && (
        <>
          <AnimatedRoutes />
          <TransitionCurtain />
        </>
      )}
    </Router>
  );
}

export default App;
