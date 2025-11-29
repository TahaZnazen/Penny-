import { useMemo, useState } from 'react';
import './JackpotScreen.css';

// Generate a random reward code
const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const JackpotScreen = ({ show }) => {
  // Generate code once when component mounts with show=true
  const rewardCode = useMemo(() => generateCode(), [show]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rewardCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
          <div className="jackpot-pigs">
            <img src="/imgs/pig.png" alt="pig" className="jackpot-pig-img" />
            <img src="/imgs/pig.png" alt="pig" className="jackpot-pig-img" />
            <img src="/imgs/pig.png" alt="pig" className="jackpot-pig-img" />
            <img src="/imgs/pig.png" alt="pig" className="jackpot-pig-img" />
            <img src="/imgs/pig.png" alt="pig" className="jackpot-pig-img" />
          </div>

          {/* Reward info */}
          <div className="jackpot-reward-info">
            <div className="jackpot-reward-amount">You win 10% of the creator-fees wallet!</div>
            <div className="jackpot-instruction">Submit this code to Penny Telegram to receive your rewards</div>
            <div className="jackpot-code" onClick={handleCopyCode} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
              {copied ? 'COPIED!' : rewardCode}
            </div>
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
