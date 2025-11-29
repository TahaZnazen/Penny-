import { Html } from '@react-three/drei';
import SlotGameContent, { useSlotGameState } from '../SlotGameContent';
import './TVScreenInGap.css';

/**
 * TVScreenInGap Component
 *
 * 3D wrapper that embeds SlotGameContent in the scene using drei's Html.
 * Used only for desktop view.
 *
 * @param {Function} onPennyWin - Callback when all 5 pennies
 * @param {Function} onPigJackpot - Callback when all 5 pigs (jackpot + explosion)
 */
const TVScreenInGap = ({ onPennyWin, onPigJackpot }) => {
  const {
    gameState,
    handleStartGame,
    handlePennyWin,
    handlePigJackpot,
    handleLose,
  } = useSlotGameState({ onPennyWin, onPigJackpot });

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
        <SlotGameContent
          gameState={gameState}
          onStartGame={handleStartGame}
          onPennyWin={handlePennyWin}
          onPigJackpot={handlePigJackpot}
          onLose={handleLose}
          isMobile={false}
        />
      </Html>
    </group>
  );
};

export default TVScreenInGap;
