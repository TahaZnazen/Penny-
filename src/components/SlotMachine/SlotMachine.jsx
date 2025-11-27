import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../AnimatedBackground/AnimatedBackground';
import SlotMachineView from '../SlotMachineView/SlotMachineView';
import './SlotMachine.css';

const SlotMachine = ({ isEmbedded = false }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
 
      navigate('/');
   
  };

  return (
    <div className="slot-machine-container">
      <button
        className="back-home-button"
        onClick={handleBackClick}
      >
          ← Back  
      </button>

      {/* <AnimatedBackground /> */}
      <SlotMachineView />
    </div>
  );
};

export default SlotMachine;
