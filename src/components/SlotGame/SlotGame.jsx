import { useState, useRef, useEffect } from 'react';
import './SlotGame.css';
import { sounds, preloadSounds, unlockAudio } from '../../utils/sounds';
import { completeSpin } from '../../services/gameApi';
import { SYMBOLS } from '../../config/gameConfig';

// Map symbol ID to index for quick lookup
const SYMBOL_ID_TO_INDEX = {};
SYMBOLS.forEach((s, i) => SYMBOL_ID_TO_INDEX[s.id] = i);

const SPIN_DURATION = 3000; // 3 seconds
const REEL_COUNT = 5;
const FINAL_SYMBOL_INDEX = 8; // The visible "result" position in the reel

// Function to select a random symbol based on weights
const getWeightedRandomSymbol = () => {
  const totalWeight = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
  let random = Math.random() * totalWeight;

  for (const symbol of SYMBOLS) {
    random -= symbol.weight;
    if (random <= 0) {
      return symbol;
    }
  }
  return SYMBOLS[0]; // Fallback
};

// Preload all symbol images into browser cache
const preloadImages = () => {
  SYMBOLS.forEach(symbol => {
    const img = new Image();
    img.src = symbol.src;
  });
  console.log('[SlotGame] Preloading', SYMBOLS.length, 'symbol images');
};

/**
 * SlotGame Component
 * @param {boolean} autoStart - Auto-start the spin when mounted
 * @param {string} gameCode - Game code for server-side result
 * @param {Function} onPennyWin - Callback when all 5 pennies
 * @param {Function} onPigJackpot - Callback when all 5 pigs (jackpot)
 * @param {Function} onLose - Callback when player loses
 */
const SlotGame = ({ autoStart = false, gameCode, onPennyWin, onPigJackpot, onLose }) => {
  const [reels, setReels] = useState(
    Array(REEL_COUNT).fill(null).map(() =>
      Array(20).fill(null).map(() => getWeightedRandomSymbol())
    )
  );
  const [spinning, setSpinning] = useState(false);
  const [stoppedReels, setStoppedReels] = useState(Array(REEL_COUNT).fill(false));
  const reelRefs = useRef([]);
  const hasStarted = useRef(false); // Track if spin already started
  const serverResult = useRef(null); // Store server result for after animation

  // Initialize reel refs, preload sounds and images
  useEffect(() => {
    reelRefs.current = reelRefs.current.slice(0, REEL_COUNT);
    preloadSounds();
    preloadImages();
  }, []);

  // Generate reels with specific final symbols at position 8
  const generateReelsWithFinalSymbols = (finalSymbolIds) => {
    return Array(REEL_COUNT).fill(null).map((_, reelIndex) => {
      const reelSymbols = Array(20).fill(null).map(() => getWeightedRandomSymbol());
      // Set the final visible position (index 8) to the server's symbol
      const finalSymbolId = finalSymbolIds[reelIndex];
      const finalSymbolIndex = SYMBOL_ID_TO_INDEX[finalSymbolId];
      if (finalSymbolIndex !== undefined) {
        reelSymbols[FINAL_SYMBOL_INDEX] = SYMBOLS[finalSymbolIndex];
      }
      return reelSymbols;
    });
  };

  // Trigger callback based on stored server result
  const handleSpinComplete = () => {
    console.log('SlotGame: handleSpinComplete called, serverResult:', serverResult.current);

    if (!serverResult.current) {
      console.error('SlotGame: No server result available');
      sounds.lose();
      if (onLose) onLose();
      return;
    }

    const result = serverResult.current;

    if (result.result === 'won_jackpot') {
      console.log('SlotGame: Jackpot - calling onPigJackpot');
      sounds.jackpot();
      if (onPigJackpot) onPigJackpot();
    } else if (result.result === 'won_penny') {
      console.log('SlotGame: Penny win - calling onPennyWin');
      sounds.pennyWin();
      if (onPennyWin) onPennyWin();
    } else {
      console.log('SlotGame: Loss - calling onLose');
      sounds.lose();
      if (onLose) onLose();
    }
  };

  const spin = async () => {
    console.log('SlotGame: spin() called, spinning:', spinning);
    console.log('SlotGame: reelRefs.current:', reelRefs.current);
    if (spinning) return;

    console.log('SlotGame: Starting spin - fetching server result first');
    setSpinning(true);
    setStoppedReels(Array(REEL_COUNT).fill(false));

    // Play spin sound
    unlockAudio(); // Unlock audio on first interaction (mobile)
    sounds.spin();

    // Fetch result from server FIRST (before animation completes)
    try {
      const result = await completeSpin(gameCode);
      console.log('SlotGame: Server result received:', result);
      serverResult.current = result;

      // Generate reels with the server's final symbols at position 8
      const newReels = generateReelsWithFinalSymbols(result.symbols);
      setReels(newReels);
    } catch (error) {
      console.error('SlotGame: Error fetching result:', error);
      serverResult.current = { result: 'lost', symbols: [], error: error.message };
      // Generate random reels on error
      const newReels = Array(REEL_COUNT).fill(null).map(() =>
        Array(20).fill(null).map(() => getWeightedRandomSymbol())
      );
      setReels(newReels);
    }

    // Start all reels spinning
    reelRefs.current.forEach((ref) => {
      if (ref) {
        // Remove any existing classes and transitions
        ref.style.transition = 'none';
        ref.classList.remove('spinning');

        // Reset to starting position (symbol 8 perfectly centered)
        ref.style.transform = 'translateY(-35%)';
      }
    });

    // Small delay to ensure styles are applied, then start spinning
    setTimeout(() => {
      reelRefs.current.forEach((ref) => {
        if (ref) {
          ref.classList.add('spinning');
        }
      });
    }, 50);

    // Stop each reel one by one from left to right
    reelRefs.current.forEach((ref, index) => {
      if (ref) {
        const stopDelay = index * 400; // 400ms delay between each reel stopping
        const spinDuration = 1000; // Duration for the deceleration animation

        setTimeout(() => {
          // Remove spinning animation
          ref.classList.remove('spinning');

          // Play reel stop sound
          sounds.reelStop();

          // Calculate final position to center symbol at index 8 perfectly
          const finalTransform = 'translateY(-35%)';

          // Apply smooth deceleration
          ref.style.transition = `transform ${spinDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
          ref.style.transform = finalTransform;

          // Mark this reel as stopped after animation completes
          setTimeout(() => {
            setStoppedReels(prev => {
              const newStopped = [...prev];
              newStopped[index] = true;
              return newStopped;
            });
          }, spinDuration);
        }, SPIN_DURATION + stopDelay);
      }
    });

    // Get result from server after all reels stop
    const totalDuration = SPIN_DURATION + (REEL_COUNT * 400) + 800;
    setTimeout(() => {
      setSpinning(false);
      handleSpinComplete();
    }, totalDuration + 200);
  };

  // Auto-start spin if autoStart prop is true (only once)
  useEffect(() => {
    console.log('SlotGame: autoStart effect, autoStart:', autoStart, 'hasStarted:', hasStarted.current);
    if (autoStart && !hasStarted.current) {
      hasStarted.current = true;
      console.log('SlotGame: Calling spin() directly');
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        console.log('SlotGame: RAF fired, calling spin()');
        spin();
      });
    }
  }, [autoStart]);

  return (
    <>
      {/* Reels Display */}
      <div className="reels-container">
        {reels.map((reel, reelIndex) => (
          <div key={reelIndex} className="reel-wrapper">
            <div className={`reel-window ${spinning && !stoppedReels[reelIndex] ? 'active-spin' : ''} ${stoppedReels[reelIndex] ? 'stopped' : ''}`}>
              <div
                ref={el => reelRefs.current[reelIndex] = el}
                className={`reel ${spinning && !stoppedReels[reelIndex] ? 'spinning' : ''}`}
              >
                {reel.map((symbol, symbolIndex) => (
                  <div
                    key={symbolIndex}
                    className={`symbol ${symbolIndex === 8 ? 'middle-symbol' : ''}`}
                  >
                    <img
                      src={symbol.src}
                      alt={symbol.alt}
                      className="symbol-image"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SlotGame;
