import React from 'react';
import { Canvas } from '@react-three/fiber';
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
