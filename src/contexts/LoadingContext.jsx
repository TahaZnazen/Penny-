import { createContext, useContext, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const LoadingContext = createContext({
  isLoaded: false,
  loadingProgress: 0,
  assetsReady: false,
});

// All assets to preload
const PRELOAD_MODELS = [
  '/models/piggybank.glb',
  '/models/slotmachine.glb',
];

const PRELOAD_TEXTURES = [
  '/textures/bg.png',
  '/textures/bg0.png',
  '/textures/loadingbg.jpeg',
  '/textures/game2.png',
];

const PRELOAD_IMAGES = [
  '/imgs/penny.png',
  '/imgs/ass.png',
  '/imgs/cool.png',
  '/imgs/pepe.png',
  '/imgs/pig.png',
  '/imgs/spit.png',
  '/imgs/trump.png',
  '/imgs/viking.png',
  '/imgs/chill.png',
];

// Preload GLB models
PRELOAD_MODELS.forEach(model => {
  useGLTF.preload(model);
});

export const LoadingProvider = ({ children }) => {
  const [assetsReady, setAssetsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = PRELOAD_TEXTURES.length + PRELOAD_IMAGES.length;

    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalAssets) * 100));
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalAssets) * 100));
          resolve(); // Resolve anyway to not block loading
        };
        img.src = src;
      });
    };

    const preloadAll = async () => {
      const allImages = [...PRELOAD_TEXTURES, ...PRELOAD_IMAGES];
      await Promise.all(allImages.map(preloadImage));
      setAssetsReady(true);
    };

    preloadAll();
  }, []);

  return (
    <LoadingContext.Provider value={{
      isLoaded: assetsReady,
      loadingProgress,
      assetsReady
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

export default LoadingContext;
