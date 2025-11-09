import { useState, useEffect } from 'react';
import './Loader.css';

export function LoadingScreen({ isLoading, onStart, assetsLoaded, isTransitioning }) {
  const [showButton, setShowButton] = useState(false);
  const [dots, setDots] = useState('');
 
  useEffect(() => {
    if (assetsLoaded) {
      const timer = setTimeout(() => setShowButton(true), 300);
      return () => clearTimeout(timer);
    }
  }, [assetsLoaded]);

  // Animated dots for loading text
  useEffect(() => {
    if (!assetsLoaded) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [assetsLoaded]);

  if (!isLoading) return null;



  return (
    <div className={`loading-screen ${assetsLoaded ? 'ready' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
        {/* Mute Button - Only show after started */}
  
      {/* Transition overlay effects */}
      {isTransitioning && (
        <>
          <div className="transition-circle"></div>
          <div className="transition-rays">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="ray" style={{ transform: `rotate(${i * 30}deg)` }}></div>
            ))}
          </div>
          <div className="transition-explosion">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="explosion-particle"
                style={{
                  '--angle': `${(360 / 30) * i}deg`,
                  '--distance': `${200 + Math.random() * 300}px`,
                  '--size': `${5 + Math.random() * 10}px`
                }}
              ></div>
            ))}
          </div>
        </>
      )}

      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['🪙', '💰', '✨', '⭐'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="loading-content">
 
        {/* Main animation */}
        <div className="animation-container">
          <div className="hammer-wrapper">
            <div className="hammer-animation">🔨</div>
            <div className="impact-effect"></div>
          </div>
          <div className="piggy-wrapper">
            <div className="piggy-animation">🐷</div>
           </div>
        </div>
        
        {/* Title with better styling */}
        <div className="title-container">
          <h1 className="loading-title">
            {assetsLoaded ? (
              <>
                <span className="title-word">Ready</span>
                <span className="title-word">to</span>
                <span className="title-word">Break</span>
                <span className="title-word">Free!</span>
              </>
            ) : (
              <>
                <span className="title-word">Loading</span>
                <span className="title-word">Penny</span>
                <span className="loading-dots">{dots}</span>
              </>
            )}
          </h1>
        </div>
        
        {!assetsLoaded ? (
          <>
            {/* Enhanced loading spinner */}
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring delay-1"></div>
              <div className="spinner-ring delay-2"></div>
              <div className="coin-loader">🪙</div>
            </div>
            
            {/* Loading tips */}
            <div className="loading-tips">
              <p className="tip">💡 Tip: Click pieces to break the piggy bank!</p>
            </div>
            
            <p className="loading-subtitle">
              <span className="pulse-text">Preparing your experience</span> ✨
            </p>
          </>
        ) : (
          <>
            {/* Success animation */}
            <div className="success-container">
              <div className="success-checkmark">✓</div>
              <p className="loading-subtitle success-text">Everything is ready! 🎉</p>
            </div>
            
            {showButton && !isTransitioning && (
              <button className="start-button" onClick={onStart}>
                <div className="button-shine"></div>
                <span className="button-text">
                  <span>Start Experience</span>
                </span>
                <div className="button-particles">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="button-particle"></div>
                  ))}
                </div>
              </button>
            )}
          </>
        )}

        {/* Bottom decoration */}
        <div className="bottom-decoration">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="corner-decoration corner-top-left">🌟</div>
      <div className="corner-decoration corner-top-right">🌟</div>
      <div className="corner-decoration corner-bottom-left">💎</div>
      <div className="corner-decoration corner-bottom-right">💎</div>
    </div>
  );
}