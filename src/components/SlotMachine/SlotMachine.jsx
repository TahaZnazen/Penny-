import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../AnimatedBackground/AnimatedBackground';
import SlotMachineView from '../SlotMachineView/SlotMachineView';
import './SlotMachine.css';

const SlotMachine = ({ isEmbedded = false }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    console.log('Back button clicked! isEmbedded:', isEmbedded);
    if (isEmbedded) {
      // Scroll to top when embedded in Home page
      console.log('Scrolling to top...');
      // Try multiple scroll methods to ensure it works
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      // Navigate to home when standalone
      console.log('Navigating to home...');
      navigate('/');
    }
  };

  return (
    <div className="slot-machine-container">
      <button
        className="back-home-button"
        onClick={handleBackClick}
      >
        {isEmbedded ? '↑ Back to Top' : '← Back'}
      </button>

      {/* <AnimatedBackground /> */}
      <SlotMachineView />
    </div>
  );
};

export default SlotMachine;
