import { Canvas } from "@react-three/fiber";
import { Experience } from "../../components/Experience";
import { useState, useEffect } from "react";
import { Preload } from "@react-three/drei";
import { audioManager } from "../../utils/audioManager";
import { FaTelegram } from "react-icons/fa";
import { PiXLogoBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { preloadImages } from "../../utils/preloadImages";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Home always shows the broken state (coin + welcome overlay)
  // Piggy breaking now happens on the slot machine page
  const isBroken = true;

  // Mark canvas as ready after a brief moment to prevent black screen
  // Also preload slot machine images in background for instant loading
  useEffect(() => {
    const timer = setTimeout(() => setIsCanvasReady(true), 100);
    preloadImages(); // Preload slot machine assets in background
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    isMuted ? audioManager.playChill() : audioManager.muteChill();
  };

  const goToSlotMachine = () => {
    navigate('/slot-machine');
  };

  return (
    <div className="container">
      {/* Brief loading overlay until canvas is ready */}
      {!isCanvasReady && (
        <div className="home-loading-overlay">
          <div className="home-loading-spinner" />
        </div>
      )}

      {/* Mute Button */}
      <button
        className="mute-button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      >
        <span className="mute-icon">{isMuted ? "🔇" : "🔊"}</span>
        <span className="mute-ripple"></span>
      </button>

      {/* Social Buttons - Always visible */}
      <div className="social-buttons-fixed">
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
          <PiXLogoBold size={24} />
        </button>
      </div>

      {/* Canvas - Shows only the penny coin (isBroken=true) */}
      <Canvas shadows camera={{ position: [4, 1, 4], fov: 35 }}>
        <Experience isBroken={isBroken} />
        <Preload all />
      </Canvas>

      {/* Welcome Overlay - Always visible since isBroken is always true */}
      {isBroken && (
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
            <div className="button-row">
              <button
                className="btn btn-penny-magic"
                onClick={() => window.open("https://penny-overlay-magic.lovable.app", "_blank")}
              >
                <span> Penny Magic</span>
              </button>
              <button
                className="btn btn-dex"
                onClick={() => window.open("https://dexscreener.com", "_blank")}
              >
                <span> Dexscreener</span>
              </button>
            </div>

            <button
              className="btn btn-try-luck"
              onClick={goToSlotMachine}
            >
              <span> Try Your Luck with Penny  </span>
            </button>

            <button
              className="btn btn-whitepaper"
              onClick={() => window.open("https://penny-1.gitbook.io/penny-docs", "_blank")}
            >
              <span>  Whitepaper</span>
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

      {/* Fixed Footer */}
      <footer className="fixed-footer">
        <div className="footer-content">
          <p className="disclaimer-title">Disclaimer:</p>
          <p className="disclaimer-text">
            Penny ($PENNY) is a community-driven memecoin with no intrinsic value or expected returns. Always DYOR.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
