import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/AnimatedBackground/AnimatedBackground';
import SlotMachineView from '../../components/SlotMachineView/SlotMachineView';
import SlotGame from '../../components/SlotGame/SlotGame';
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

      {/* 3D Model - Desktop only (hidden on mobile) */}
      <div className="slot-machine-3d-view">
        <SlotMachineView />
      </div>

      {/* Slot Game UI - Mobile only (hidden on desktop) */}
      <div className="slot-machine-game-view">
        <SlotGame />
      </div>
    </div>
  );
};

export default SlotMachine;
