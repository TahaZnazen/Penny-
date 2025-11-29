import { useMemo, useState } from 'react';
import './WinPennyScreen.css';

// Generate a random reward code
const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const WinPennyScreen = ({ show }) => {
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
    <div className="penny-win-overlay">
      <div className="penny-win-content">
        {/* Animated background circles */}
        <div className="penny-bg-circles">
          <div className="penny-circle penny-circle-1"></div>
          <div className="penny-circle penny-circle-2"></div>
          <div className="penny-circle penny-circle-3"></div>
        </div>

        {/* Main win text */}
        <div className="penny-main-text">
          <h1 className="penny-title">PENNY WIN!</h1>
          <div className="penny-subtitle">5 PENNIES!</div>
          <div className="penny-coins">
            <img src="/imgs/penny.png" alt="penny" className="penny-coin" />
            <img src="/imgs/penny.png" alt="penny" className="penny-coin" />
            <img src="/imgs/penny.png" alt="penny" className="penny-coin" />
            <img src="/imgs/penny.png" alt="penny" className="penny-coin" />
            <img src="/imgs/penny.png" alt="penny" className="penny-coin" />
          </div>

          {/* Reward info */}
          <div className="penny-reward-info">
            <div className="penny-reward-amount">You win 1 SOL (the value of one Penny)</div>
            <div className="penny-instruction">Submit this code to Penny Telegram to receive your rewards</div>
            <div className="penny-code" onClick={handleCopyCode} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
              {copied ? 'COPIED!' : rewardCode}
            </div>
          </div>
        </div>

        {/* Animated particles */}
        <div className="penny-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`penny-particle penny-particle-${i}`}></div>
          ))}
        </div>

        {/* Rays of light */}
        <div className="penny-rays">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`penny-ray penny-ray-${i}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WinPennyScreen;
