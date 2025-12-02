import './WinPennyScreen.css';

const WinPennyScreen = ({ show }) => {
  const handleShareToX = () => {
    const text = `I just won 1 SOL on @PennySOLL ! 5 Pennies in a row! Try your luck:`;
    const url = 'https://Solpenny.com';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
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
            <div className="penny-instruction">Contact Penny bot on Telegram to receive your reward</div>
            <button className="flex-win-btn penny-share-btn" onClick={handleShareToX}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Flex your win
            </button>
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
