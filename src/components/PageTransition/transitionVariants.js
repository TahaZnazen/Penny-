// Collection of different page transition animations

export const fadeVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

export const slideLeftVariants = {
  initial: { opacity: 0, x: 100 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -100 }
};

export const slideRightVariants = {
  initial: { opacity: 0, x: -100 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 100 }
};

export const slideUpVariants = {
  initial: { opacity: 0, y: 100 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -100 }
};

export const slideDownVariants = {
  initial: { opacity: 0, y: -100 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: 100 }
};

export const scaleVariants = {
  initial: { opacity: 0, scale: 0.8 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.2 }
};

export const zoomVariants = {
  initial: { opacity: 0, scale: 0 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 0 }
};

export const rotateVariants = {
  initial: { opacity: 0, rotate: -180, scale: 0.8 },
  in: { opacity: 1, rotate: 0, scale: 1 },
  out: { opacity: 0, rotate: 180, scale: 0.8 }
};

export const flipVariants = {
  initial: { opacity: 0, rotateY: 90 },
  in: { opacity: 1, rotateY: 0 },
  out: { opacity: 0, rotateY: -90 }
};

export const blurFadeVariants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  in: { opacity: 1, filter: 'blur(0px)' },
  out: { opacity: 0, filter: 'blur(10px)' }
};

export const slideScaleVariants = {
  initial: { opacity: 0, x: 100, scale: 0.8 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: -100, scale: 0.8 }
};

export const depthVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    z: -100,
    filter: 'blur(4px)'
  },
  in: {
    opacity: 1,
    scale: 1,
    z: 0,
    filter: 'blur(0px)'
  },
  out: {
    opacity: 0,
    scale: 1.1,
    z: 100,
    filter: 'blur(4px)'
  }
};

export const bounceVariants = {
  initial: { opacity: 0, scale: 0.3 },
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15
    }
  },
  out: { opacity: 0, scale: 0.3 }
};

// Transition configurations
export const pageTransitions = {
  fade: {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  },
  slide: {
    type: 'spring',
    stiffness: 100,
    damping: 20
  },
  scale: {
    type: 'spring',
    stiffness: 200,
    damping: 25
  },
  fast: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
  },
  slow: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.8
  },
  smooth: {
    type: 'spring',
    stiffness: 80,
    damping: 15
  }
};
