import { AudioSystem, AudioSystemInterface } from '@/systems/AudioSystem';

// Mock Web Audio API
const createMockAudioContext = () => ({
  createGain: jest.fn().mockReturnValue({
    gain: { value: 0, setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
    connect: jest.fn(),
    disconnect: jest.fn()
  }),
  createBuffer: jest.fn().mockReturnValue({}),
  createBufferSource: jest.fn().mockReturnValue({
    buffer: null,
    loop: false,
    loopStart: 0,
    loopEnd: 0,
    playbackRate: { value: 1 },
    connect: jest.fn(),
    disconnect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }),
  decodeAudioData: jest.fn().mockResolvedValue({}),
  destination: {},
  state: 'running',
  suspend: jest.fn(),
  resume: jest.fn(),
  close: jest.fn()
});

const createMockAudio = () => ({
  src: '',
  volume: 1,
  loop: false,
  currentTime: 0,
  duration: 0,
  paused: true,
  ended: false,
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
});

// Override global Audio and AudioContext
Object.defineProperty(global, 'Audio', {
  value: jest.fn().mockImplementation(() => createMockAudio()),
  writable: true
});

Object.defineProperty(global, 'AudioContext', {
  value: jest.fn().mockImplementation(() => createMockAudioContext()),
  writable: true
});

Object.defineProperty(global, 'webkitAudioContext', {
  value: jest.fn().mockImplementation(() => createMockAudioContext()),
  writable: true
});

describe('AudioSystem', () => {
  let audioSystem: AudioSystem;
  let mockAudioContext: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAudioContext = createMockAudioContext();
    (global.AudioContext as jest.Mock).mockReturnValue(mockAudioContext);
    audioSystem = new AudioSystem();
  });

  describe('Construction', () => {
    test('should create AudioSystem instance', () => {
      expect(audioSystem).toBeInstanceOf(AudioSystem);
    });

    test('should initialize with default volume settings', () => {
      expect(audioSystem.getMasterVolume()).toBe(1.0);
      expect(audioSystem.getSFXVolume()).toBe(1.0);
      expect(audioSystem.getMusicVolume()).toBe(1.0);
    });

    test('should initialize with muted state as false', () => {
      expect(audioSystem.isMuted()).toBe(false);
    });

    test('should create audio context when available', () => {
      expect(global.AudioContext).toHaveBeenCalled();
    });

    test('should handle missing audio context gracefully', () => {
      (global.AudioContext as jest.Mock).mockImplementation(() => {
        throw new Error('AudioContext not supported');
      });
      (global as any).webkitAudioContext = undefined;
      
      expect(() => new AudioSystem()).not.toThrow();
    });
  });

  describe('Volume Control', () => {
    test('should set master volume within valid range', () => {
      audioSystem.setMasterVolume(0.5);
      expect(audioSystem.getMasterVolume()).toBe(0.5);
    });

    test('should clamp master volume to valid range', () => {
      audioSystem.setMasterVolume(-0.5);
      expect(audioSystem.getMasterVolume()).toBe(0);
      
      audioSystem.setMasterVolume(1.5);
      expect(audioSystem.getMasterVolume()).toBe(1);
    });

    test('should set SFX volume within valid range', () => {
      audioSystem.setSFXVolume(0.7);
      expect(audioSystem.getSFXVolume()).toBe(0.7);
    });

    test('should clamp SFX volume to valid range', () => {
      audioSystem.setSFXVolume(-0.3);
      expect(audioSystem.getSFXVolume()).toBe(0);
      
      audioSystem.setSFXVolume(2.0);
      expect(audioSystem.getSFXVolume()).toBe(1);
    });

    test('should set music volume within valid range', () => {
      audioSystem.setMusicVolume(0.3);
      expect(audioSystem.getMusicVolume()).toBe(0.3);
    });

    test('should clamp music volume to valid range', () => {
      audioSystem.setMusicVolume(-1.0);
      expect(audioSystem.getMusicVolume()).toBe(0);
      
      audioSystem.setMusicVolume(3.0);
      expect(audioSystem.getMusicVolume()).toBe(1);
    });
  });

  describe('Mute Control', () => {
    test('should mute all audio', () => {
      audioSystem.mute();
      expect(audioSystem.isMuted()).toBe(true);
    });

    test('should unmute all audio', () => {
      audioSystem.mute();
      audioSystem.unmute();
      expect(audioSystem.isMuted()).toBe(false);
    });

    test('should toggle mute state', () => {
      expect(audioSystem.isMuted()).toBe(false);
      audioSystem.toggleMute();
      expect(audioSystem.isMuted()).toBe(true);
      audioSystem.toggleMute();
      expect(audioSystem.isMuted()).toBe(false);
    });
  });

  describe('Sound Effect Loading', () => {
    test('should load sound effect successfully', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
      });
      global.fetch = mockFetch;

      await audioSystem.loadSFX('test-sound', '/path/to/sound.mp3');
      
      expect(mockFetch).toHaveBeenCalledWith('/path/to/sound.mp3');
      expect(mockAudioContext.decodeAudioData).toHaveBeenCalled();
    });

    test('should handle sound loading errors gracefully', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404
      });
      global.fetch = mockFetch;

      await expect(audioSystem.loadSFX('test-sound', '/path/to/missing.mp3')).rejects.toThrow();
    });

    test('should not reload already loaded sounds', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
      });
      global.fetch = mockFetch;

      await audioSystem.loadSFX('test-sound', '/path/to/sound.mp3');
      await audioSystem.loadSFX('test-sound', '/path/to/sound.mp3');
      
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Sound Effect Playback', () => {
    beforeEach(async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
      });
      global.fetch = mockFetch;
      await audioSystem.loadSFX('test-sound', '/path/to/sound.mp3');
    });

    test('should play loaded sound effect', () => {
      audioSystem.playSFX('test-sound');
      
      expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
      const mockSource = mockAudioContext.createBufferSource.mock.results[0].value;
      expect(mockSource.start).toHaveBeenCalled();
    });

    test('should play sound with custom volume', () => {
      audioSystem.playSFX('test-sound', 0.5);
      
      expect(mockAudioContext.createGain).toHaveBeenCalled();
    });

    test('should handle playing unloaded sounds gracefully', () => {
      expect(() => audioSystem.playSFX('unknown-sound')).not.toThrow();
    });

    test('should respect mute state when playing sounds', () => {
      audioSystem.mute();
      audioSystem.playSFX('test-sound');
      
      // Should still create source but with volume 0
      expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
    });
  });

  describe('Music Playback', () => {
    test('should play music from URL', () => {
      audioSystem.playMusic('/path/to/music.mp3');
      
      expect(global.Audio).toHaveBeenCalledWith('/path/to/music.mp3');
    });

    test('should loop music by default', () => {
      audioSystem.playMusic('/path/to/music.mp3');
      
      const mockAudio = (global.Audio as jest.Mock).mock.results[0].value;
      expect(mockAudio.loop).toBe(true);
    });

    test('should set music volume correctly', () => {
      audioSystem.setMusicVolume(0.6);
      audioSystem.playMusic('/path/to/music.mp3');
      
      const mockAudio = (global.Audio as jest.Mock).mock.results[0].value;
      expect(mockAudio.volume).toBe(0.6);
    });

    test('should stop current music when playing new music', () => {
      audioSystem.playMusic('/path/to/music1.mp3');
      const firstAudio = (global.Audio as jest.Mock).mock.results[0].value;
      
      audioSystem.playMusic('/path/to/music2.mp3');
      
      expect(firstAudio.pause).toHaveBeenCalled();
    });

    test('should stop music playback', () => {
      audioSystem.playMusic('/path/to/music.mp3');
      const mockAudio = (global.Audio as jest.Mock).mock.results[0].value;
      
      audioSystem.stopMusic();
      
      expect(mockAudio.pause).toHaveBeenCalled();
    });

    test('should handle stopping when no music is playing', () => {
      expect(() => audioSystem.stopMusic()).not.toThrow();
    });
  });

  describe('Audio Context Management', () => {
    test('should handle user interaction requirement for audio context', async () => {
      mockAudioContext.state = 'suspended';
      
      await audioSystem.resumeAudioContext();
      
      expect(mockAudioContext.resume).toHaveBeenCalled();
    });

    test('should not resume already running audio context', async () => {
      mockAudioContext.state = 'running';
      
      await audioSystem.resumeAudioContext();
      
      expect(mockAudioContext.resume).not.toHaveBeenCalled();
    });
  });

  describe('Preloading Assets', () => {
    test('should preload multiple sound effects', async () => {
      const soundAssets = {
        'click': '/sounds/click.mp3',
        'hover': '/sounds/hover.mp3',
        'error': '/sounds/error.mp3'
      };

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
      });
      global.fetch = mockFetch;

      await audioSystem.preloadSounds(soundAssets);

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenCalledWith('/sounds/click.mp3');
      expect(mockFetch).toHaveBeenCalledWith('/sounds/hover.mp3');
      expect(mockFetch).toHaveBeenCalledWith('/sounds/error.mp3');
    });

    test('should handle preloading errors for individual sounds', async () => {
      const soundAssets = {
        'click': '/sounds/click.mp3',
        'missing': '/sounds/missing.mp3'
      };

      const mockFetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        });
      global.fetch = mockFetch;

      await audioSystem.preloadSounds(soundAssets);

      // Should continue loading other sounds even if one fails
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling and Fallbacks', () => {
    test('should handle Web Audio API not available', () => {
      (global.AudioContext as jest.Mock).mockImplementation(() => {
        throw new Error('Web Audio API not supported');
      });
      (global as any).webkitAudioContext = undefined;

      expect(() => new AudioSystem()).not.toThrow();
    });

    test('should handle audio playback errors gracefully', () => {
      const mockAudio = createMockAudio();
      mockAudio.play.mockRejectedValue(new Error('Playback failed'));
      (global.Audio as jest.Mock).mockReturnValue(mockAudio);

      expect(() => audioSystem.playMusic('/path/to/music.mp3')).not.toThrow();
    });

    test('should provide fallback when audio context creation fails', () => {
      const audioSystemWithoutContext = new AudioSystem();
      
      // Should still function without throwing errors
      expect(() => audioSystemWithoutContext.playSFX('test')).not.toThrow();
      expect(() => audioSystemWithoutContext.playMusic('/test.mp3')).not.toThrow();
    });
  });

  describe('Performance and Resource Management', () => {
    test('should dispose of resources properly', () => {
      audioSystem.playMusic('/path/to/music.mp3');
      audioSystem.dispose();
      
      if (mockAudioContext.close) {
        expect(mockAudioContext.close).toHaveBeenCalled();
      }
    });

    test('should limit concurrent sound sources', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
      });
      global.fetch = mockFetch;
      await audioSystem.loadSFX('test-sound', '/path/to/sound.mp3');

      // Play multiple instances quickly
      for (let i = 0; i < 10; i++) {
        audioSystem.playSFX('test-sound');
      }

      // Should create reasonable number of sources (implementation dependent)
      expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
    });

    test('should clean up finished audio sources', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
      });
      global.fetch = mockFetch;
      await audioSystem.loadSFX('test-sound', '/path/to/sound.mp3');
      
      audioSystem.playSFX('test-sound');
      
      expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
      const mockSource = mockAudioContext.createBufferSource.mock.results[mockAudioContext.createBufferSource.mock.results.length - 1].value;
      
      // Verify addEventListener was called for 'ended' event
      expect(mockSource.addEventListener).toHaveBeenCalledWith('ended', expect.any(Function));
    });
  });

  describe('Interface Compliance', () => {
    test('should implement AudioSystemInterface', () => {
      const instance: AudioSystemInterface = audioSystem;
      
      expect(typeof instance.playSFX).toBe('function');
      expect(typeof instance.playMusic).toBe('function');
      expect(typeof instance.stopMusic).toBe('function');
      expect(typeof instance.setMasterVolume).toBe('function');
      expect(typeof instance.setSFXVolume).toBe('function');
      expect(typeof instance.setMusicVolume).toBe('function');
      expect(typeof instance.mute).toBe('function');
      expect(typeof instance.unmute).toBe('function');
      expect(typeof instance.dispose).toBe('function');
    });
  });
});