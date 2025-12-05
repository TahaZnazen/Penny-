import React from 'react';
import { Canvas } from '@react-three/fiber';
import { FaTelegram } from 'react-icons/fa';
import JackpotScreen from '../JackpotScreen/JackpotScreen';
import WinPennyScreen from '../WinPennyScreen/WinPennyScreen';
import SlotGameContent, { useSlotGameState } from '../SlotGameContent';
import UnifiedSlotScene from './UnifiedSlotScene';
import { PRIZES } from '../../config/gameConfig';
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
          <div className="prize-info-header">
            <div className="prize-info-title">Win Prizes</div>
            <div className="prize-info-alert">
              <span className="alert-icon">&#9432;</span>
              <div className="prize-info-popover">
                <p>These prizes are for <strong>pre-launch giveaway</strong> purposes only.</p>
                <p>For official prize details after launch, please check our whitepaper:</p>
                <a
                  href="https://penny-1.gitbook.io/penny-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitepaper-link"
                >
                  View Whitepaper
                </a>
              </div>
            </div>
          </div>
          <div className="prize-info-row">
            <img src="/imgs/penny.png" alt="Penny" className="prize-icon" />
            <span className="prize-label">1 Penny</span>
            <span className="prize-value">{PRIZES.PENNY_WIN_AMOUNT} {PRIZES.PENNY_WIN_UNIT}</span>
          </div>
          <div className="prize-info-row jackpot-row">
            <img src="/imgs/pig.png" alt="Pig" className="prize-icon" />
            <span className="prize-label">Jackpot</span>
            <span className="prize-value jackpot-value">{PRIZES.JACKPOT_AMOUNT} {PRIZES.JACKPOT_UNIT}</span>
          </div>

          <div className="how-to-play">
            <span className="how-to-play-title">How to Play</span>
            <p className="how-to-play-text">Get your game code from our Telegram bot to start spinning!</p>
          </div>

          <a
            href="https://web.telegram.org/k/#@penny_slot_bot"
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
