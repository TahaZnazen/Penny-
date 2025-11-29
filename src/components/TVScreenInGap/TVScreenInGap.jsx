import React from 'react';
import { Html } from '@react-three/drei';
import TVScreen from '../TVScreen/TVScreen';
import SlotGame from '../SlotGame/SlotGame';
import './TVScreenInGap.css';

/**
 * TVScreenInGap Component
 *
 * This component handles the TV screen logic embedded in 3D space.
 * It manages the game start state and renders the screen with the slot game.
 *
 * Game States:
 * - 'idle': Show SPIN button
 * - 'spinning': Show slot game (reels spinning)
 * - 'penny': Show penny win (triggers onPennyWin)
 * - 'pig': Show pig jackpot (triggers onPigJackpot)
 * - 'lose': Show lost screen
 *
 * @param {Function} onPennyWin - Callback when all 5 pennies
 * @param {Function} onPigJackpot - Callback when all 5 pigs (jackpot + explosion)
 */
const TVScreenInGap = ({ onPennyWin, onPigJackpot }) => {
  const [gameState, setGameState] = React.useState('idle'); // 'idle' | 'spinning' | 'penny' | 'pig' | 'lose'

  const handleStartGame = () => {
    setGameState('spinning');
  };

  const handlePennyWin = () => {
    console.log('TVScreenInGap: handlePennyWin called');
    setGameState('penny');
    if (onPennyWin) onPennyWin();
  };

  const handlePigJackpot = () => {
    console.log('TVScreenInGap: handlePigJackpot called');
    setGameState('pig');
    if (onPigJackpot) onPigJackpot();
  };

  const handleLose = () => {
    console.log('TVScreenInGap: handleLose called');
    setGameState('lose');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'idle':
        return (
          <div className="start-screen">
            <button className="big-spin-button" onClick={handleStartGame}>
              SPIN
            </button>
          </div>
        );

      case 'spinning':
        return (
          <TVScreen>
            <SlotGame
              autoStart={true}
              onPennyWin={handlePennyWin}
              onPigJackpot={handlePigJackpot}
              onLose={handleLose}
            />
          </TVScreen>
        );

      case 'penny':
        // Penny win screen - handled by parent (WinPennyScreen overlay)
        // Show the reels frozen in winning position
        return (
          <TVScreen>
            <SlotGame autoStart={false} />
          </TVScreen>
        );

      case 'pig':
        // Pig jackpot screen - handled by parent (JackpotScreen overlay)
        // Show the reels frozen in winning position
        return (
          <TVScreen>
            <SlotGame autoStart={false} />
          </TVScreen>
        );

      case 'lose':
        return (
          <div className="lost-screen">
            <div className="lost-text">LOST!</div>
            <div className="lost-subtitle">Better luck next time</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <group
      position={[0, 0, -0.2]}
      rotation={[0, 0, 0]}
      scale={0.7}
    >
      <Html
        transform
        occlude="blending"
        position={[0, 0.07, 0]}
        distanceFactor={1}
        style={{
          width: '1600px',
          height: '850px',
          pointerEvents: 'auto',
        }}
      >
        {renderContent()}
      </Html>
    </group>
  );
};

export default TVScreenInGap;
