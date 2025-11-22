import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import { useState } from "react";
import { Preload } from "@react-three/drei";
import { audioManager } from "../utils/audioManager";
import { FaTelegram } from "react-icons/fa";
import { PiXLogoBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [isBroken, setIsbroken] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

      {/* Canvas */}
      <Canvas shadows camera={{ position: [4, 1, 4], fov: 35 }}>
        <Experience setIsbroken={setIsbroken} />
        <Preload all />
      </Canvas>

      {/* UI Overlays */}
      {!isBroken && (
        <div className="click-message animate-in">
          Click to Break <br /> the Piggy Bank!
        </div>
      )}

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
              <span>🎰 Try Your Luck with Penny 🎰</span>
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
