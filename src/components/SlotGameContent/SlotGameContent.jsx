import React from 'react';
import TVScreen from '../TVScreen/TVScreen';
import SlotGame from '../SlotGame/SlotGame';
import { validateGameCode, startSpin, isDevMode } from '../../services/gameApi';
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
  const [gameCode, setGameCode] = React.useState('');
  const [activeGameCode, setActiveGameCode] = React.useState(''); // Code being used for current spin
  const [isValidating, setIsValidating] = React.useState(false);
  const [validationError, setValidationError] = React.useState('');
  const containerClass = isMobile ? 'slot-game-content mobile' : 'slot-game-content';

  // Enable spin button only when game code is entered and not validating
  const isSpinEnabled = gameCode.trim().length > 0 && !isValidating;

  // Handle spin button click with validation
  const handleSpinClick = async () => {
    if (!isSpinEnabled) return;

    setIsValidating(true);
    setValidationError('');

    try {
      // Validate the game code
      const validation = await validateGameCode(gameCode);

      if (!validation.valid) {
        setValidationError(validation.error || 'Invalid code');
        setIsValidating(false);
        return;
      }

      // Start the spin session
      const spinResult = await startSpin(gameCode);

      if (!spinResult.success) {
        setValidationError(spinResult.error || 'Failed to start');
        setIsValidating(false);
        return;
      }

      // Code is valid, store active code and start the game
      console.log('Game code validated! Starting game...');
      setActiveGameCode(gameCode);
      if (onStartGame) onStartGame(gameCode);
    } catch (error) {
      console.error('Spin validation error:', error);
      setValidationError('Connection error. Try again.');
    }

    setIsValidating(false);
  };

  switch (gameState) {
    case 'idle':
      return (
        <div className={`${containerClass} start-screen`}>
          <div className="game-code-container">
            <input
              type="text"
              className="game-code-input"
              placeholder={isDevMode ? "DEV MODE: Any code works" : "Enter Game Code"}
              value={gameCode}
              onChange={(e) => {
                setGameCode(e.target.value.toUpperCase());
                setValidationError(''); // Clear error on input change
              }}
              autoComplete="off"
              disabled={isValidating}
            />
            {validationError && (
              <div className="validation-error">{validationError}</div>
            )}
          </div>
          <button
            className={`big-spin-button ${!isSpinEnabled ? 'disabled' : ''}`}
            disabled={!isSpinEnabled}
            onClick={handleSpinClick}
            onTouchEnd={(e) => {
              if (!isSpinEnabled) return;
              e.preventDefault();
              handleSpinClick();
            }}
          >
            {isValidating ? 'VALIDATING...' : 'SPIN'}
          </button>
        </div>
      );

    case 'spinning':
      return (
        <div className={containerClass}>
          <TVScreen>
            <SlotGame
              autoStart={true}
              gameCode={activeGameCode}
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
