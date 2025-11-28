import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TransitionCurtain = () => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger curtain on route change
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Adjusted for slower transition

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {isAnimating && (
        <motion.div
          initial={{ y: '100vh' }}
          animate={{ y: 0 }}
          exit={{ y: '-100vh' }}
          transition={{
            duration: 0.3,
            ease: [0.43, 0.13, 0.23, 0.96],
           }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            backgroundImage: 'url(/textures/animation.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            pointerEvents: 'none'
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default TransitionCurtain;
