import { useNavigate } from 'react-router-dom';
import SlotMachineView from '../../components/SlotMachineView/SlotMachineView';
import './SlotMachine.css';

const SlotMachine = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
      navigate('/home');
  };

  return (
    <div className="slot-machine-container">
      <button
        className="back-home-button"
        onClick={handleBackClick}
      >
          ← Back
      </button>

      {/* SlotMachineView handles both desktop (3D) and mobile (2D) */}
      <SlotMachineView />
    </div>
  );
};

export default SlotMachine;
