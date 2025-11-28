import { useTexture } from '@react-three/drei';

/**
 * Preloads ThunderEffect assets during MinimalLoader phase
 * This prevents blank screens when transitioning to ThunderLoader
 */
const PreloadThunderAssets = () => {
  // Preload the background texture used in ThunderEffect
  useTexture('/textures/loadingbg.jpeg');

  return null;
};

export default PreloadThunderAssets;
