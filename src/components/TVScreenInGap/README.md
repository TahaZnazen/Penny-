# TVScreenInGap Component

This component contains the TV screen logic extracted from SlotMachine.jsx. It's designed to be animation-ready without touching the working game logic.

## Structure

```
TVScreenInGap/
├── TVScreenInGap.jsx    # Main component with game logic
├── TVScreenInGap.css    # Styles for start screen and SPIN button
├── index.js             # Export file
└── README.md            # This file
```

## Component Props

- `onJackpot` (Function): Callback triggered when the jackpot is hit

## How to Add R3F Animations

You can wrap or modify the `<group>` element in TVScreenInGap.jsx to add animations without touching the game logic:

### Example 1: Add a floating animation
```jsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const TVScreenInGap = ({ onJackpot }) => {
  const groupRef = useRef();
  const [gameStarted, setGameStarted] = React.useState(false);

  // Add animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Float up and down
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, -0.2]}
      // ... rest of props
    >
      {/* ... existing HTML content */}
    </group>
  );
};
```

### Example 2: Add rotation animation
```jsx
useFrame((state) => {
  if (groupRef.current) {
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  }
});
```

### Example 3: Add spring animations with react-spring
```jsx
import { useSpring, animated } from '@react-spring/three';

const TVScreenInGap = ({ onJackpot }) => {
  const [gameStarted, setGameStarted] = React.useState(false);

  const springs = useSpring({
    scale: gameStarted ? 0.7 : 0.5,
    config: { tension: 200, friction: 20 }
  });

  return (
    <animated.group
      scale={springs.scale}
      position={[0, 0, -0.2]}
      // ... rest of props
    >
      {/* ... existing HTML content */}
    </animated.group>
  );
};
```

## Game Logic (DO NOT MODIFY)

The following logic manages the game state and should not be modified:
- `gameStarted` state - Controls whether to show SPIN button or the game
- `handleStartGame` - Transitions from start screen to game
- `onJackpot` callback - Triggers jackpot events to parent component

## Safe to Modify

- `position`, `rotation`, `scale` props on the `<group>` element
- Add `ref` to the group for animations
- Wrap with animated components from react-spring/three
- Add `useFrame` hooks for continuous animations
- Add event handlers for hover/click effects on the group
