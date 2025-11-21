import { useState, useRef, useEffect } from 'react';
import './SlotGame.css';

const SlotGame = ({ autoStart = false }) => {
  // Define symbols with images and weights (higher weight = more common)
  // Weight examples: 1 = very rare, 10 = common, 20 = very common
  const SYMBOLS = [
    { id: 'penny', src: '/imgs/penny.png', alt: 'Penny', weight: 1 },        // JACKPOT - VERY RARE
    { id: 'ass', src: '/imgs/ass.png', alt: 'ass', weight: 12 },
    { id: 'cool', src: '/imgs/cool.png', alt: 'cool', weight: 12 },
    { id: 'pepe', src: '/imgs/pepe.png', alt: 'pepe', weight: 12 },
    { id: 'pig', src: '/imgs/pig.png', alt: 'pig', weight: 12 },
    { id: 'spit', src: '/imgs/spit.png', alt: 'spit', weight: 12 },
    { id: 'trump', src: '/imgs/trump.png', alt: 'trump', weight: 12 },
    { id: 'viking', src: '/imgs/viking.png', alt: 'viking', weight: 12 },
    { id: 'cill', src: '/imgs/chill.png', alt: 'cill', weight: 12 },
  ];

  const JACKPOT_SYMBOL = 'penny'; // Only 5 pennies win the jackpot

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

  const SPIN_DURATION = 3000; // 3 seconds
  const REEL_COUNT = 5;
  const VISIBLE_SYMBOLS = 3;

  const [reels, setReels] = useState(
    Array(REEL_COUNT).fill(null).map(() =>
      Array(20).fill(null).map(() => getWeightedRandomSymbol())
    )
  );
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [stoppedReels, setStoppedReels] = useState(Array(REEL_COUNT).fill(false));
  const reelRefs = useRef([]);

  // Initialize reel refs
  useEffect(() => {
    reelRefs.current = reelRefs.current.slice(0, REEL_COUNT);
  }, []);

  // Auto-start spin if autoStart prop is true
  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(() => {
        spin();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);
    setStoppedReels(Array(REEL_COUNT).fill(false));

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
        // Symbol 8's middle (42.5% of reel) aligns with window middle (50%)
        // Window shows 15% of reel, so starts at 35% (42.5 - 7.5)
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

          // Calculate final position to center symbol at index 8 perfectly
          // Window shows 15% of reel (3/20), positioned to show symbols 7, 8, 9
          // Symbol 8's center (42.5%) aligns with window center (50%)
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

  const checkWin = (currentReels) => {
    // Get the middle symbol from each reel (index 8)
    const middleSymbols = currentReels.map(reel => reel[8]);

    // Check if all 5 symbols are pennies (the JACKPOT symbol)
    const allPennies = middleSymbols.every(symbol => symbol.id === JACKPOT_SYMBOL);

    if (allPennies) {
      // ALL 5 PENNIES - JACKPOT!
      setResult({ type: 'jackpot', message: '🎊 JACKPOT! 5 Pennies! 🎊', symbols: middleSymbols });
    } else {
      // Anything else is a loss
      setResult({ type: 'lose', message: 'Try Again!', symbols: middleSymbols });
    }
  };

  return (
    <>
      {/* Title Bar */}
      {/* <div className="screen-header">
        <span className="screen-title">PENNY SLOTS</span>
      </div> */}

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
            {/* Win indicator line */}
            <div className="win-line"></div>
          </div>
        ))}
      </div>

      {/* Result Display */}
      {/* {result && (
        <div className={`result-display ${result.type}`}>
          <div className="result-text">{result.message}</div>
        </div>
      )} */}

      {/* Control Panel */}
      {/* <div className="control-panel">
        <button
          onClick={spin}
          disabled={spinning}
          className={`spin-button ${spinning ? 'spinning' : ''}`}
        >
          {spinning ? 'SPINNING...' : 'SPIN'}
        </button>
      </div> */}
    </>
  );
};

export default SlotGame;
