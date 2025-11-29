class AudioManager {
  constructor() {
    this.breakSound = new Audio('/audios/break.mp3');
    this.finalSound = new Audio('/audios/final.mp3');
    this.chillSound = new Audio('/audios/chill.mp3');
    this.thunderSound = new Audio('/audios/thunder.mp3');
    this.rainSound = new Audio('/audios/rain.mp3');


    // Preload audio
    this.breakSound.load();
    this.finalSound.load();
    this.chillSound.load();
    this.thunderSound.load();
    this.rainSound.load();

    // Set volumes (adjust as needed)
    this.breakSound.volume = 0.5;
    this.finalSound.volume = 0.7;
    this.thunderSound.volume = 0.6;
    this.rainSound.volume = 0.3;

    // Loop ambient sounds
    this.rainSound.loop = true;
    this.chillSound.loop = true;
  }

  playBreak() {
    this.breakSound.currentTime = 0; // Reset to start
    this.breakSound.play().catch(e => console.log('Audio play failed:', e));
  }

  playFinal() {
    this.finalSound.currentTime = 0;
    this.finalSound.play().catch(e => console.log('Audio play failed:', e));
  }

  stopAll() {
    this.breakSound.pause();
    this.finalSound.pause();
    this.breakSound.currentTime = 0;
    this.finalSound.currentTime = 0;
  }

  playChill() {
    // Only play if not already playing to prevent overlap
    if (this.chillSound.paused) {
      this.chillSound.volume = 0.4;
      this.chillSound.play().catch(e => console.warn('Chill audio play failed:', e));
    }
  }
    muteChill(){
    this.chillSound.pause();
  }

  playThunder() {
    this.thunderSound.currentTime = 0;
    this.thunderSound.play().catch(e => console.log('Thunder audio play failed:', e));
  }

  playRain() {
    if (this.rainSound.paused) {
      this.rainSound.play().catch(e => console.log('Rain audio play failed:', e));
    }
  }

  stopRain() {
    this.rainSound.pause();
    this.rainSound.currentTime = 0;
  }

  // Background music (alias for playChill for clarity)
  playBackgroundMusic() {
    this.playChill();
  }

  stopBackgroundMusic() {
    this.muteChill();
  }
}

export const audioManager = new AudioManager();