import React from 'react';
import { Canvas } from '@react-three/fiber';
import { FaTelegram } from 'react-icons/fa';
import JackpotScreen from '../JackpotScreen/JackpotScreen';
import WinPennyScreen from '../WinPennyScreen/WinPennyScreen';
import SlotGameContent, { useSlotGameState } from '../SlotGameContent';
import UnifiedSlotScene from './UnifiedSlotScene';
import './SlotMachineView.css';

// Hook to detect mobile
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const SlotMachineView = () => {
  const [showJackpotScreen, setShowJackpotScreen] = React.useState(false);
  const [showPennyWinScreen, setShowPennyWinScreen] = React.useState(false);
  const [phase, setPhase] = React.useState('piggy'); // 'piggy' | 'slot-machine'
  const [prizeInfoOpen, setPrizeInfoOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Shared game state for mobile (desktop uses TVScreenInGap's own state)
  const mobileGameState = useSlotGameState({
    onPennyWin: () => {
      console.log('MobileView: handlePennyWin called');
      setShowPennyWinScreen(true);
    },
    onPigJackpot: () => {
      console.log('MobileView: handlePigJackpot called');
      setShowJackpotScreen(true);
    },
  });

  const handlePennyWin = () => {
    console.log('SlotMachineView: handlePennyWin called');
    setShowPennyWinScreen(true);
  };

  const handlePigJackpot = () => {
    console.log('SlotMachineView: handlePigJackpot called');
    setShowJackpotScreen(true);
  };

  const handlePhaseChange = (newPhase) => {
    console.log('SlotMachineView: Phase changing to:', newPhase);
    setPhase(newPhase);
  };

  return (
    <div className="slot-machine-view">
      {/* Prize Info Section - Top Right (Desktop) / Bottom Right Collapsible (Mobile) */}
      {isMobile && !prizeInfoOpen ? (
        /* Mobile: Collapsed state - just show ? button */
        <button
          className="prize-info-toggle"
          onClick={() => setPrizeInfoOpen(true)}
          aria-label="Show prize info"
        >
          ?
        </button>
      ) : (
        /* Desktop: Always visible / Mobile: Expanded state */
        <div className={`prize-info-section ${isMobile ? 'mobile-expanded' : ''}`}>
          {isMobile && (
            <button
              className="prize-info-close"
              onClick={() => setPrizeInfoOpen(false)}
              aria-label="Close prize info"
            >
              ✕
            </button>
          )}
          <div className="beta-over-banner">
            <span className="beta-over-title">Beta is Over!</span>
            <p className="beta-over-text">Keep playing for fun until the official launch.</p>
          </div>

          <div className="how-to-play">
            <span className="how-to-play-title">How to Play</span>
            <p className="how-to-play-text">Get your game code from our Telegram bot to start spinning!</p>
          </div>

          <a
            href="https://t.me/penny_slot_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="get-code-btn"
          >
            <FaTelegram className="telegram-icon" />
            Get Your Code
          </a>
        </div>
      )}

      {isMobile ? (
        /* Mobile: 2D game only, no 3D Canvas */
        <SlotGameContent
          gameState={mobileGameState.gameState}
          onStartGame={mobileGameState.handleStartGame}
          onPennyWin={mobileGameState.handlePennyWin}
          onPigJackpot={mobileGameState.handlePigJackpot}
          onLose={mobileGameState.handleLose}
          isMobile={true}
        />
      ) : (
        /* Desktop: Unified 3D experience (piggy → slot machine) */
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <UnifiedSlotScene
            phase={phase}
            onPhaseChange={handlePhaseChange}
            onPennyWin={handlePennyWin}
            onPigJackpot={handlePigJackpot}
          />
        </Canvas>
      )}

      {/* Jackpot Win Screen Overlay (all 5 pigs) */}
      <JackpotScreen show={showJackpotScreen} />

      {/* Penny Win Screen Overlay (all 5 pennies) */}
      <WinPennyScreen show={showPennyWinScreen} />
    </div>
  );
};

export default SlotMachineView;
