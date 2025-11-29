/**
 * Sound Manager for Slot Machine
 *
 * Sound files should be placed in /public/sounds/
 * - spin.mp3       - When reels start spinning
 * - reel-stop.mp3  - When each reel stops (plays 5 times)
 * - lose.mp3       - Losing sound
 * - penny-win.mp3  - Penny win celebration
 * - jackpot.mp3    - Big jackpot win
 */

// Sound file paths
const SOUNDS = {
  spin: '/sounds/spin.mp3',
  reelStop: '/sounds/reel-stop.mp3',
  lose: '/sounds/lose.mp3',
  pennyWin: '/sounds/penny-win.mp3',
  jackpot: '/sounds/jackpot.mp3',
};

// Audio cache
const audioCache = {};

// Track if audio is unlocked (for mobile)
let audioUnlocked = false;

/**
 * Preload all sounds
 */
export const preloadSounds = () => {
  Object.entries(SOUNDS).forEach(([key, src]) => {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audioCache[key] = audio;
  });
};

/**
 * Unlock audio on mobile (call this on first user interaction)
 */
export const unlockAudio = () => {
  if (audioUnlocked) return;

  // Create and play a silent audio to unlock
  const silentAudio = new Audio();
  silentAudio.play().catch(() => {});

  // Also try to play each cached audio silently
  Object.values(audioCache).forEach(audio => {
    audio.volume = 0;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
    }).catch(() => {});
  });

  audioUnlocked = true;
};

/**
 * Play a sound
 * @param {string} soundName - Name of the sound (spin, reelStop, lose, pennyWin, jackpot)
 * @param {number} volume - Volume level 0-1 (default: 1)
 */
export const playSound = (soundName, volume = 1) => {
  try {
    // Get from cache or create new
    let audio = audioCache[soundName];

    if (!audio) {
      const src = SOUNDS[soundName];
      if (!src) {
        console.warn(`Sound "${soundName}" not found`);
        return;
      }
      audio = new Audio(src);
      audioCache[soundName] = audio;
    }

    // Clone the audio for overlapping plays (like reel-stop)
    const audioClone = audio.cloneNode();
    audioClone.volume = volume;
    audioClone.play().catch(err => {
      console.warn(`Failed to play sound "${soundName}":`, err.message);
    });

    return audioClone;
  } catch (err) {
    console.warn(`Error playing sound "${soundName}":`, err.message);
  }
};

/**
 * Stop a sound
 * @param {HTMLAudioElement} audio - Audio element to stop
 */
export const stopSound = (audio) => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};

// Sound player functions for convenience
export const sounds = {
  spin: (volume = 0.7) => playSound('spin', volume),
  reelStop: (volume = 0.5) => playSound('reelStop', volume),
  lose: (volume = 0.6) => playSound('lose', volume),
  pennyWin: (volume = 0.8) => playSound('pennyWin', volume),
  jackpot: (volume = 1) => playSound('jackpot', volume),
};

export default sounds;
