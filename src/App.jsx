import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState, useEffect } from "react";
import { LoadingScreen } from "./components/loader/LoadingScreen";
import { useProgress, Preload } from "@react-three/drei";
import { audioManager } from "./utils/audioManager";
import { FaTelegram, FaTwitter } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { PiXLogoBold } from "react-icons/pi";
// import { SiDextools } from 'react-icons/si';

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
  const [isBroken, setIsbroken] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    isMuted ? audioManager.playChill() : audioManager.muteChill();
  };

  return (
    <div className="container">
      {/* Mute Button - Only show after started */}
      {hasStarted && (
        <button
          className="mute-button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
          <span className="mute-icon">{isMuted ? "🔇" : "🔊"}</span>
          <span className="mute-ripple"></span>
        </button>
      )}

      <LoadingScreen
        isLoading={!hasStarted}
        onStart={handleStart}
        assetsLoaded={assetsLoaded}
        isTransitioning={isTransitioning}
      />

      {/* Canvas always renders for asset loading */}
      <Canvas shadows camera={{ position: [4, 1, 4], fov: 35 }}>
        <Experience setIsbroken={setIsbroken} />
        <Preload all />
        <AssetsTracker onReady={handleAssetsReady} />
      </Canvas>

      {/* UI Overlays - only show after started */}
      {hasStarted && !isBroken && (
        <div className="click-message animate-in">
          Click to Break <br /> the Piggy Bank!
        </div>
      )}

      {hasStarted && isBroken && (
        <div className="welcome-overlay animate-in">
          <h1 className="welcome-title">Welcome To Penny!</h1>

          <div className="ca-container">
            <p className="ca-label">🌈 Contract Address 🌈</p>
            <p className="ca-address">Coming soon</p>
          </div>

          <div className="button-container">
            <button
              className="btn btn-buy"
              onClick={() => window.open("https://raydium.io", "_blank")}
            >
              <span> Buy Now</span>
            </button>
            <button
              className="btn btn-dex"
              onClick={() => window.open("https://dexscreener.com", "_blank")}
            >
              <span> Dexscreener</span>
            </button>
            <div className="social-buttons">
              <button
                className="btn btn-icon btn-telegram"
                onClick={() =>
                  window.open(
                    "https://web.telegram.org/k/#@PennySOLLL",
                    "_blank"
                  )
                }
                aria-label="Telegram"
              >
                <FaTelegram size={24} />
              </button>

              <button
                className="btn btn-icon btn-twitter"
                onClick={() => window.open("https://x.com/PennySOLL", "_blank")}
                aria-label="Twitter"
              >
                <PiXLogoBold  size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
