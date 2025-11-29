import React from 'react';
import TVScreen from '../TVScreen/TVScreen';
import SlotGame from '../SlotGame/SlotGame';
import './SlotGameContent.css';

/**
 * useSlotGameState Hook
 *
 * Shared game state logic for both desktop (3D) and mobile (2D) views.
 *
 * Game States:
 * - 'idle': Show SPIN button
 * - 'spinning': Show slot game (reels spinning)
 * - 'penny': Penny win (triggers onPennyWin)
 * - 'pig': Pig jackpot (triggers onPigJackpot)
 * - 'lose': Show lost screen
 */
export const useSlotGameState = ({ onPennyWin, onPigJackpot }) => {
  const [gameState, setGameState] = React.useState('idle');

  const handleStartGame = () => {
    console.log('handleStartGame called! Changing to spinning');
    setGameState('spinning');
  };

  const handlePennyWin = () => {
    console.log('SlotGameState: handlePennyWin called');
    setGameState('penny');
    if (onPennyWin) onPennyWin();
  };

  const handlePigJackpot = () => {
    console.log('SlotGameState: handlePigJackpot called');
    setGameState('pig');
    if (onPigJackpot) onPigJackpot();
  };

  const handleLose = () => {
    console.log('SlotGameState: handleLose called');
    setGameState('lose');
  };

  return {
    gameState,
    handleStartGame,
    handlePennyWin,
    handlePigJackpot,
    handleLose,
  };
};

/**
 * SlotGameContent Component
 *
 * Pure UI component for the slot game content.
 * Used by both desktop (wrapped in Html) and mobile (rendered directly).
 *
 * @param {string} gameState - Current game state
 * @param {Function} onStartGame - Called when SPIN button clicked
 * @param {Function} onPennyWin - Passed to SlotGame
 * @param {Function} onPigJackpot - Passed to SlotGame
 * @param {Function} onLose - Passed to SlotGame
 * @param {boolean} isMobile - Whether rendering on mobile (affects styling)
 */
const SlotGameContent = ({
  gameState,
  onStartGame,
  onPennyWin,
  onPigJackpot,
  onLose,
  isMobile = false
}) => {
  const containerClass = isMobile ? 'slot-game-content mobile' : 'slot-game-content';

  switch (gameState) {
    case 'idle':
      return (
        <div className={`${containerClass} start-screen`}>
          <button
            className="big-spin-button"
            onClick={() => {
              console.log('SPIN button clicked!');
              if (onStartGame) onStartGame();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              console.log('SPIN button touched!');
              if (onStartGame) onStartGame();
            }}
          >
            SPIN
          </button>
        </div>
      );

    case 'spinning':
      return (
        <div className={containerClass}>
          <TVScreen>
            <SlotGame
              autoStart={true}
              onPennyWin={onPennyWin}
              onPigJackpot={onPigJackpot}
              onLose={onLose}
            />
          </TVScreen>
        </div>
      );

    case 'penny':
    case 'pig':
      // Win screens - on mobile hide the game, on desktop show frozen reels
      if (isMobile) {
        return null;
      }
      return (
        <div className={containerClass}>
          <TVScreen>
            <SlotGame autoStart={false} />
          </TVScreen>
        </div>
      );

    case 'lose':
      return (
        <div className={`${containerClass} lost-screen`}>
      
        </div>
      );

    default:
      return null;
  }
};

export default SlotGameContent;
