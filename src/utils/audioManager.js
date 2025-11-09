class AudioManager {
  constructor() {
    this.breakSound = new Audio('/audios/break.mp3');
    this.finalSound = new Audio('/audios/final.mp3');
    this.chillSound = new Audio('/audios/chill.mp3');

    
    // Preload audio
    this.breakSound.load();
    this.finalSound.load();
    this.chillSound.load();
    
    // Set volumes (adjust as needed)
    this.breakSound.volume = 0.5;
    this.finalSound.volume = 0.7;
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

  playChill(){
    this.chillSound.play();
    this.chillSound.volume = 0.4;

  }
    muteChill(){
    this.chillSound.pause();
 
  }
}

export const audioManager = new AudioManager();