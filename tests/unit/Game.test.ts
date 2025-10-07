import '../helpers/mockThree';
import { Game } from '@core/Game';

describe('Game', () => {
  let game: Game;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockCanvas = document.createElement('canvas');
    game = new Game(mockCanvas);
  });

  afterEach(() => {
    if (game) {
      game.dispose();
    }
  });

  describe('Initialization', () => {
    test('should initialize with canvas', () => {
      expect(game).toBeDefined();
      expect(game.renderer).toBeDefined();
      expect(game.scene).toBeDefined();
      expect(game.camera).toBeDefined();
    });

    test('should set correct canvas size', () => {
      expect(game.renderer.domElement.width).toBeGreaterThan(0);
      expect(game.renderer.domElement.height).toBeGreaterThan(0);
    });

    test('should initialize camera at correct position', () => {
      expect(game.camera.position.y).toBe(1.6);
      expect(game.camera.position.x).toBe(0);
      expect(game.camera.position.z).toBe(0);
    });
  });

  describe('Game Loop', () => {
    test('should start game loop', () => {
      const updateSpy = jest.spyOn(game as any, 'update');
      game.start();
      
      // Wait for next frame
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          expect(updateSpy).toHaveBeenCalled();
          game.stop();
          resolve(true);
        });
      });
    });

    test('should stop game loop', () => {
      game.start();
      const isRunning1 = game.isRunning();
      game.stop();
      const isRunning2 = game.isRunning();
      
      expect(isRunning1).toBe(true);
      expect(isRunning2).toBe(false);
    });

    test('should call update with delta time', () => {
      const updateSpy = jest.spyOn(game as any, 'update');
      game.start();
      
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          expect(updateSpy).toHaveBeenCalledWith(expect.any(Number));
          game.stop();
          resolve(true);
        });
      });
    });
  });

  describe('Resize', () => {
    test('should handle window resize', () => {
      const newWidth = 1024;
      const newHeight = 768;
      
      game.handleResize(newWidth, newHeight);
      
      expect(game.camera.aspect).toBe(newWidth / newHeight);
      expect(game.renderer.domElement.width).toBe(newWidth);
      expect(game.renderer.domElement.height).toBe(newHeight);
    });
  });
});