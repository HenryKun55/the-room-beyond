/**
 * AudioSystem - Isolated audio management system
 * Provides sound effects, music playback, and volume control
 */

export interface AudioSystemInterface {
  playSFX(soundId: string, volume?: number): void;
  playMusic(url: string, loop?: boolean): void;
  stopMusic(): void;
  setMasterVolume(volume: number): void;
  setSFXVolume(volume: number): void;
  setMusicVolume(volume: number): void;
  getMasterVolume(): number;
  getSFXVolume(): number;
  getMusicVolume(): number;
  mute(): void;
  unmute(): void;
  isMuted(): boolean;
  dispose(): void;
}

export class AudioSystem implements AudioSystemInterface {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 1.0;
  private sfxVolume: number = 1.0;
  private musicVolume: number = 1.0;
  private muted: boolean = false;
  
  private soundBuffers: Map<string, AudioBuffer> = new Map();
  private currentMusic: HTMLAudioElement | null = null;
  private activeSources: Set<AudioBufferSourceNode> = new Set();

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      // Try to create AudioContext with fallback to webkit
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      } else {
        console.warn('AudioSystem: Web Audio API not supported, using fallback');
      }
    } catch (error) {
      console.warn('AudioSystem: Failed to create AudioContext', error);
    }
  }

  async loadSFX(soundId: string, url: string): Promise<void> {
    if (this.soundBuffers.has(soundId)) {
      return; // Already loaded
    }

    if (!this.audioContext) {
      console.warn('AudioSystem: Cannot load sound, no AudioContext available');
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load sound: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.soundBuffers.set(soundId, audioBuffer);
    } catch (error) {
      console.error(`AudioSystem: Failed to load sound "${soundId}" from "${url}"`, error);
      throw error;
    }
  }

  async preloadSounds(soundAssets: Record<string, string>): Promise<void> {
    const loadPromises = Object.entries(soundAssets).map(async ([soundId, url]) => {
      try {
        await this.loadSFX(soundId, url);
      } catch (error) {
        console.warn(`AudioSystem: Failed to preload sound "${soundId}"`, error);
        // Continue loading other sounds even if one fails
      }
    });

    await Promise.all(loadPromises);
  }

  playSFX(soundId: string, volume: number = 1.0): void {
    if (!this.audioContext || !this.soundBuffers.has(soundId)) {
      return;
    }

    try {
      const buffer = this.soundBuffers.get(soundId)!;
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      // Calculate final volume
      const finalVolume = this.muted ? 0 : volume * this.sfxVolume * this.masterVolume;
      gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);

      // Connect audio graph
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Clean up when sound finishes
      source.addEventListener('ended', () => {
        this.activeSources.delete(source);
        source.disconnect();
        gainNode.disconnect();
      });

      // Track active source
      this.activeSources.add(source);

      // Start playback
      source.start();
    } catch (error) {
      console.warn('AudioSystem: Failed to play sound effect', error);
    }
  }

  playMusic(url: string, loop: boolean = true): void {
    try {
      // Stop current music if playing
      this.stopMusic();

      // Create new audio element
      this.currentMusic = new Audio(url);
      this.currentMusic.loop = loop;
      this.currentMusic.volume = this.muted ? 0 : this.musicVolume * this.masterVolume;

      // Handle loading and playback errors
      this.currentMusic.addEventListener('error', (error) => {
        console.warn('AudioSystem: Music playback error', error);
      });

      // Start playback
      this.currentMusic.play().catch(error => {
        console.warn('AudioSystem: Failed to start music playback', error);
      });
    } catch (error) {
      console.warn('AudioSystem: Failed to play music', error);
    }
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateMusicVolume();
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateMusicVolume();
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  getSFXVolume(): number {
    return this.sfxVolume;
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  private updateMusicVolume(): void {
    if (this.currentMusic) {
      this.currentMusic.volume = this.muted ? 0 : this.musicVolume * this.masterVolume;
    }
  }

  mute(): void {
    this.muted = true;
    this.updateMusicVolume();
  }

  unmute(): void {
    this.muted = false;
    this.updateMusicVolume();
  }

  toggleMute(): void {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('AudioSystem: Failed to resume AudioContext', error);
      }
    }
  }

  dispose(): void {
    // Stop all active sources
    this.activeSources.forEach(source => {
      try {
        source.stop();
        source.disconnect();
      } catch (error) {
        // Source may already be stopped
      }
    });
    this.activeSources.clear();

    // Stop music
    this.stopMusic();

    // Close audio context
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (error) {
        console.warn('AudioSystem: Failed to close AudioContext', error);
      }
      this.audioContext = null;
    }

    // Clear sound buffers
    this.soundBuffers.clear();
  }
}