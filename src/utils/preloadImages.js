/**
 * Image Preloader for Slot Machine
 *
 * Preloads critical images so they're cached before needed.
 * This prevents slow loading of background images and symbols.
 */

// Critical images to preload
const PRELOAD_IMAGES = [
  // Backgrounds
  '/textures/game2.PNG',
   '/textures/gamelost.jpeg',
  '/textures/mobileLost.jpeg',

 
 
];

// Track loading state
let imagesLoaded = false;
let loadingPromise = null;

/**
 * Preload all critical images
 * @returns {Promise} Resolves when all images are loaded
 */
export const preloadImages = () => {
  if (imagesLoaded) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = Promise.all(
    PRELOAD_IMAGES.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => {
          console.warn(`Failed to preload image: ${src}`);
          resolve(src); // Resolve anyway to not block other images
        };
        img.src = src;
      });
    })
  ).then(() => {
    imagesLoaded = true;
    console.log('All images preloaded');
  });

  return loadingPromise;
};

/**
 * Check if images are already loaded
 */
export const areImagesLoaded = () => imagesLoaded;

export default preloadImages;
