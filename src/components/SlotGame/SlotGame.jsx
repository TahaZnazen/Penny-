import { useState, useRef, useEffect } from 'react';
import './SlotGame.css';
import { sounds, preloadSounds, unlockAudio } from '../../utils/sounds';

// Define symbols with images and weights (higher weight = more common)
const SYMBOLS = [
  { id: 'penny', src: '/imgs/penny.png', alt: 'Penny', weight: 5 },
  { id: 'pig', src: '/imgs/pig.png', alt: 'pig', weight: 5 },
  { id: 'ass', src: '/imgs/ass.png', alt: 'ass', weight: 12 },
  { id: 'cool', src: '/imgs/cool.png', alt: 'cool', weight: 12 },
  { id: 'pepe', src: '/imgs/pepe.png', alt: 'pepe', weight: 12 },
  { id: 'spit', src: '/imgs/spit.png', alt: 'spit', weight: 12 },
  { id: 'trump', src: '/imgs/trump.png', alt: 'trump', weight: 12 },
  { id: 'viking', src: '/imgs/viking.png', alt: 'viking', weight: 12 },
  { id: 'cill', src: '/imgs/chill.png', alt: 'cill', weight: 12 },
];

const SPIN_DURATION = 3000; // 3 seconds
const REEL_COUNT = 5;

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

/**
 * SlotGame Component
 * @param {boolean} autoStart - Auto-start the spin when mounted
 * @param {Function} onPennyWin - Callback when all 5 pennies
 * @param {Function} onPigJackpot - Callback when all 5 pigs (jackpot)
 * @param {Function} onLose - Callback when player loses
 */
const SlotGame = ({ autoStart = false, onPennyWin, onPigJackpot, onLose }) => {
  const [reels, setReels] = useState(
    Array(REEL_COUNT).fill(null).map(() =>
      Array(20).fill(null).map(() => getWeightedRandomSymbol())
    )
  );
  const [spinning, setSpinning] = useState(false);
  const [stoppedReels, setStoppedReels] = useState(Array(REEL_COUNT).fill(false));
  const reelRefs = useRef([]);
  const hasStarted = useRef(false); // Track if spin already started

  // Initialize reel refs and preload sounds
  useEffect(() => {
    reelRefs.current = reelRefs.current.slice(0, REEL_COUNT);
    preloadSounds();
  }, []);

  const checkWin = (currentReels) => {
    // Get the middle symbol from each reel (index 8)
    const middleSymbols = currentReels.map(reel => reel[8]);
    console.log('SlotGame: checkWin called, middle symbols:', middleSymbols.map(s => s.id));

    // Check if all 5 symbols are the same
    const allPennies = middleSymbols.every(symbol => symbol.id === 'penny');
    const allPigs = middleSymbols.every(symbol => symbol.id === 'pig');

    if (allPennies) {
      // ALL 5 PENNIES - Penny Win!
      console.log('SlotGame: All pennies - calling onPennyWin');
      sounds.pennyWin();
      if (onPennyWin) onPennyWin();
    } else if (allPigs) {
      // ALL 5 PIGS - JACKPOT!
      console.log('SlotGame: All pigs - calling onPigJackpot');
      sounds.jackpot();
      if (onPigJackpot) onPigJackpot();
    } else {
      // Anything else is a loss
      console.log('SlotGame: Loss - calling onLose');
      sounds.lose();
      if (onLose) onLose();
    }
  };

  const spin = () => {
    console.log('SlotGame: spin() called, spinning:', spinning);
    console.log('SlotGame: reelRefs.current:', reelRefs.current);
    if (spinning) return;

    console.log('SlotGame: Starting spin animation');
    setSpinning(true);
    setStoppedReels(Array(REEL_COUNT).fill(false));

    // Play spin sound
    unlockAudio(); // Unlock audio on first interaction (mobile)
    sounds.spin();

    // Generate new random symbols for each reel using weighted probabilities
    const newReels = Array(REEL_COUNT).fill(null).map(() =>
      Array(20).fill(null).map(() => getWeightedRandomSymbol())
    );
    setReels(newReels);

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

    // Check result after all reels stop
    const totalDuration = SPIN_DURATION + (REEL_COUNT * 400) + 800;
    setTimeout(() => {
      setSpinning(false);
      checkWin(newReels);
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
