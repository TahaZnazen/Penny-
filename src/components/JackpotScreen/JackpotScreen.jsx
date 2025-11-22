import React from 'react';
import './JackpotScreen.css';

const JackpotScreen = ({ show }) => {
  if (!show) return null;

  return (
    <div className="jackpot-overlay">
      <div className="jackpot-content">
        {/* Animated background circles */}
        <div className="jackpot-bg-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>

        {/* Main jackpot text */}
        <div className="jackpot-main-text">
          <h1 className="jackpot-title">JACKPOT!</h1>
          <div className="jackpot-subtitle">YOU WIN!</div>
          <div className="jackpot-pennies">
            🪙 🪙 🪙 🪙 🪙
          </div>
        </div>

        {/* Animated particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>

        {/* Rays of light */}
        <div className="rays">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`ray ray-${i}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JackpotScreen;
