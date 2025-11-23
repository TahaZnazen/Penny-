import React from 'react';
import { Html } from '@react-three/drei';
import TVScreen from '../TVScreen/TVScreen';
import SlotGame from '../SlotGame/SlotGame';
import './TVScreenInGap.css';

/**
 * TVScreenInGap Component
 *
 * This component handles the TV screen logic embedded in 3D space.
 * It manages the game start state and renders the screen with the slot game.
 *
 * Extract this component to add R3F animations without touching the game logic.
 *
 * @param {Function} onJackpot - Callback function triggered when jackpot is hit
 */
const TVScreenInGap = ({ onJackpot }) => {
  const [gameStarted, setGameStarted] = React.useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <group
      position={[0, 0, -0.2]}
      rotation={[0, 0, 0]}
      scale={0.7}
    >
      <Html
        transform
        occlude="blending"
        position={[0, 0.07, 0]}
        distanceFactor={1}
        style={{
          width: '1600px',
          height: '850px',
          pointerEvents: 'auto',
        }}
      >
        {!gameStarted ? (
          // Step 1: Show big SPIN button
          <div className="start-screen">
            <button className="big-spin-button" onClick={handleStartGame}>
              SPIN
            </button>
          </div>
        ) : (
          // Step 2: Show game and auto-start spinning
          <TVScreen>
            <SlotGame autoStart={true} onJackpot={onJackpot} />
          </TVScreen>
        )}
      </Html>
    </group>
  );
};

export default TVScreenInGap;
