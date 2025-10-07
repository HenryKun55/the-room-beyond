import { InputHandler } from '@core/InputHandler';

describe('InputHandler', () => {
  let inputHandler: InputHandler;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockCanvas = document.createElement('canvas');
    document.body.appendChild(mockCanvas);
    inputHandler = new InputHandler(mockCanvas);
  });

  afterEach(() => {
    inputHandler.dispose();
    document.body.removeChild(mockCanvas);
  });

  describe('Mouse Events', () => {
    test('should track mouse position', () => {
      const event = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200
      });
      mockCanvas.dispatchEvent(event);

      const mousePos = inputHandler.getMousePosition();
      expect(mousePos.x).toBe(100);
      expect(mousePos.y).toBe(200);
    });

    test('should detect mouse click', () => {
      const callback = jest.fn();
      inputHandler.onClickCallback(callback);

      const event = new MouseEvent('click', {
        clientX: 50,
        clientY: 50,
        bubbles: true
      });
      
      mockCanvas.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(50, 50);
    });

    test('should detect mouse down and up', () => {
      const downEvent = new MouseEvent('mousedown');
      const upEvent = new MouseEvent('mouseup');

      mockCanvas.dispatchEvent(downEvent);
      expect(inputHandler.isMouseDown()).toBe(true);

      mockCanvas.dispatchEvent(upEvent);
      expect(inputHandler.isMouseDown()).toBe(false);
    });
  });

  describe('Keyboard Events', () => {
    test('should track key press', () => {
      const event = new KeyboardEvent('keydown', { key: 'w' });
      window.dispatchEvent(event);

      expect(inputHandler.isKeyPressed('w')).toBe(true);
    });

    test('should track key release', () => {
      const downEvent = new KeyboardEvent('keydown', { key: 'a' });
      const upEvent = new KeyboardEvent('keyup', { key: 'a' });

      window.dispatchEvent(downEvent);
      expect(inputHandler.isKeyPressed('a')).toBe(true);

      window.dispatchEvent(upEvent);
      expect(inputHandler.isKeyPressed('a')).toBe(false);
    });

    test('should track multiple keys simultaneously', () => {
      const w = new KeyboardEvent('keydown', { key: 'w' });
      const a = new KeyboardEvent('keydown', { key: 'a' });

      window.dispatchEvent(w);
      window.dispatchEvent(a);

      expect(inputHandler.isKeyPressed('w')).toBe(true);
      expect(inputHandler.isKeyPressed('a')).toBe(true);
    });
  });

  describe('Event Cleanup', () => {
    test('should remove event listeners on dispose', () => {
      const callback = jest.fn();
      inputHandler.onClickCallback(callback);
      inputHandler.dispose();

      const event = new MouseEvent('click');
      mockCanvas.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });
  });
});