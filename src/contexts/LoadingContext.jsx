import { createContext, useContext, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const LoadingContext = createContext({
  isLoaded: false,
  loadingProgress: 0,
  assetsReady: false,
});

// All assets to preload - optimized for faster initial load
// Slot machine model is loaded lazily when needed (not preloaded)
const PRELOAD_MODELS = [
  '/models/piggybank.glb',
  // '/models/slotMachine2.glb',  // Lazy loaded - 41MB too heavy for preload
];

const PRELOAD_TEXTURES = [
  // Heavy textures removed from preload - loaded on demand
  // '/textures/bg.png',      // 7.2MB
  // '/textures/bg0.png',     // 5MB
  // '/textures/game2.PNG',   // 9.1MB
];

const PRELOAD_IMAGES = [
  '/imgs/penny.png',
  '/imgs/pig.png',
  '/imgs/1.PNG',
  '/imgs/2.PNG',
  '/imgs/3.PNG',
  '/imgs/4.PNG',
  '/imgs/5.PNG',
  '/imgs/6.PNG',
  '/imgs/7.PNG',
  '/imgs/8.PNG',
  '/imgs/9.PNG',
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
