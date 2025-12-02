import './JackpotScreen.css';
import { getJackpotText, getShareText } from '../../config/gameConfig';

const JackpotScreen = ({ show }) => {
  const handleShareToX = () => {
    const text = getShareText.jackpot();
    const url = 'https://Solpenny.com';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
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
            <div className="jackpot-reward-amount">{getJackpotText()}</div>
            <div className="jackpot-instruction">Contact Penny bot on Telegram to receive your reward</div>
            <button className="flex-win-btn jackpot-share-btn" onClick={handleShareToX}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Flex your win
            </button>
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
