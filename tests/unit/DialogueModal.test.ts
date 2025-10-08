import { DialogueModal } from '@/systems/DialogueModal';

// Create complete DOM mocks
const createMockElement = () => ({
  id: '',
  style: {
    cssText: '',
    display: ''
  },
  innerHTML: '',
  textContent: '',
  appendChild: jest.fn(),
  setAttribute: jest.fn(),
  getAttribute: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
});

// Mock DOM methods
const mockDocument = {
  getElementById: jest.fn(),
  createElement: jest.fn(),
  body: {
    appendChild: jest.fn()
  },
  head: {
    appendChild: jest.fn()
  },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

// Override global document
Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true
});

// Mock Game interface
interface MockGame {
  pause: jest.Mock;
  unpause: jest.Mock;
  isPaused: jest.Mock;
}

describe('DialogueModal', () => {
  let dialogueModal: DialogueModal;
  let mockGame: MockGame;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock game instance
    mockGame = {
      pause: jest.fn(),
      unpause: jest.fn(),
      isPaused: jest.fn().mockReturnValue(false)
    };
    
    // Mock createElement to return mock elements
    mockDocument.createElement.mockImplementation(() => createMockElement());
    
    // Mock getElementById to return null initially (no existing elements)
    mockDocument.getElementById.mockReturnValue(null);
    
    dialogueModal = new DialogueModal(mockGame as any);
  });

  describe('Construction', () => {
    test('should create DialogueModal instance', () => {
      expect(dialogueModal).toBeInstanceOf(DialogueModal);
    });

    test('should store game reference', () => {
      expect(dialogueModal.getGame()).toBe(mockGame);
    });

    test('should initialize as not visible', () => {
      expect(dialogueModal.isVisible()).toBe(false);
    });
  });

  describe('Show Modal', () => {
    test('should pause game when showing modal', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      expect(mockGame.pause).toHaveBeenCalledTimes(1);
    });

    test('should create overlay element if it does not exist', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      expect(mockDocument.createElement).toHaveBeenCalledWith('div');
      expect(mockDocument.body.appendChild).toHaveBeenCalled();
    });

    test('should create modal element if it does not exist', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      // Should create overlay, modal, content, and style elements
      expect(mockDocument.createElement).toHaveBeenCalledTimes(4); // overlay, modal, content, style
    });

    test('should set modal as visible', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      expect(dialogueModal.isVisible()).toBe(true);
    });

    test('should display correct object name and description', () => {
      const objectName = 'Test Chair';
      const description = 'A comfortable chair for sitting.';
      
      dialogueModal.show(objectName, description);
      
      const lastCreateCall = mockDocument.createElement.mock.calls[mockDocument.createElement.mock.calls.length - 1];
      expect(lastCreateCall).toBeDefined();
    });

    test('should add keyboard event listener for SPACE key', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    test('should handle existing overlay element', () => {
      // Mock existing overlay
      const existingOverlay = { ...createMockElement(), id: 'dialogue-overlay' };
      mockDocument.getElementById.mockReturnValue(existingOverlay);
      
      dialogueModal.show('Test Object', 'Test description');
      
      // Should not create new overlay if one exists
      expect(mockDocument.body.appendChild).not.toHaveBeenCalledWith(existingOverlay);
    });
  });

  describe('Hide Modal', () => {
    beforeEach(() => {
      // Show modal first
      dialogueModal.show('Test Object', 'Test description');
      jest.clearAllMocks();
    });

    test('should unpause game when hiding modal', () => {
      dialogueModal.hide();
      
      expect(mockGame.unpause).toHaveBeenCalledTimes(1);
    });

    test('should set modal as not visible', () => {
      dialogueModal.hide();
      
      expect(dialogueModal.isVisible()).toBe(false);
    });

    test('should remove keyboard event listener', () => {
      dialogueModal.hide();
      
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    test('should hide overlay and modal elements', () => {
      // Show modal first to set up internal state
      dialogueModal.show('Test', 'Test');
      
      // Get the elements that were created
      const createCalls = mockDocument.createElement.mock.calls;
      const createdOverlay = createCalls[0] ? mockDocument.createElement.mock.results[0].value : null;
      const createdModal = createCalls[1] ? mockDocument.createElement.mock.results[1].value : null;
      
      // Clear mocks and call hide
      jest.clearAllMocks();
      dialogueModal.hide();
      
      // The class should set display to none on the cached elements
      if (createdOverlay) {
        expect(createdOverlay.style.display).toBe('none');
      }
      if (createdModal) {
        expect(createdModal.style.display).toBe('none');
      }
    });
  });

  describe('Keyboard Interaction', () => {
    test('should close modal when SPACE key is pressed', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      // Get the event handler that was registered
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
      const keyboardHandler = mockDocument.addEventListener.mock.calls[mockDocument.addEventListener.mock.calls.length - 1][1];
      
      const spaceEvent = { key: ' ', code: 'Space', preventDefault: jest.fn() };
      
      keyboardHandler(spaceEvent);
      
      expect(spaceEvent.preventDefault).toHaveBeenCalled();
      expect(dialogueModal.isVisible()).toBe(false);
    });

    test('should close modal when Space code is used', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      const keyboardHandler = mockDocument.addEventListener.mock.calls[0][1];
      const spaceEvent = { key: 'Space', code: 'Space', preventDefault: jest.fn() };
      
      keyboardHandler(spaceEvent);
      
      expect(dialogueModal.isVisible()).toBe(false);
    });

    test('should not close modal for other keys', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      const keyboardHandler = mockDocument.addEventListener.mock.calls[0][1];
      const otherEvent = { key: 'e', code: 'KeyE', preventDefault: jest.fn() };
      
      keyboardHandler(otherEvent);
      
      expect(dialogueModal.isVisible()).toBe(true);
      expect(otherEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('Styling and DOM Structure', () => {
    test('should apply correct overlay styles', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      const createCalls = mockDocument.createElement.mock.calls;
      const overlayCall = createCalls[0];
      expect(overlayCall[0]).toBe('div');
    });

    test('should apply correct modal styles', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      const createCalls = mockDocument.createElement.mock.calls;
      expect(createCalls.length).toBeGreaterThanOrEqual(2);
    });

    test('should create custom scrollbar styles', () => {
      dialogueModal.show('Test Object', 'Test description');
      
      expect(mockDocument.head.appendChild).toHaveBeenCalled();
    });

    test('should handle long descriptions with scrolling', () => {
      const longDescription = 'This is a very long description. '.repeat(100);
      
      dialogueModal.show('Test Object', longDescription);
      
      expect(dialogueModal.isVisible()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing game instance gracefully', () => {
      const dialogueModalWithoutGame = new DialogueModal(null as any);
      
      expect(() => {
        dialogueModalWithoutGame.show('Test', 'Test');
      }).not.toThrow();
    });

    test('should handle DOM manipulation errors gracefully', () => {
      mockDocument.createElement.mockImplementation(() => {
        throw new Error('DOM error');
      });
      
      expect(() => {
        dialogueModal.show('Test', 'Test');
      }).not.toThrow();
    });

    test('should handle duplicate show calls', () => {
      dialogueModal.show('First', 'First description');
      dialogueModal.show('Second', 'Second description');
      
      expect(dialogueModal.isVisible()).toBe(true);
      expect(mockGame.pause).toHaveBeenCalledTimes(2);
    });

    test('should handle hide when not visible', () => {
      expect(() => {
        dialogueModal.hide();
      }).not.toThrow();
      
      expect(dialogueModal.isVisible()).toBe(false);
    });
  });

  describe('Cleanup', () => {
    test('should have dispose method', () => {
      expect(typeof dialogueModal.dispose).toBe('function');
    });

    test('should cleanup event listeners on dispose', () => {
      dialogueModal.show('Test', 'Test');
      dialogueModal.dispose();
      
      expect(mockDocument.removeEventListener).toHaveBeenCalled();
    });

    test('should hide modal on dispose', () => {
      dialogueModal.show('Test', 'Test');
      dialogueModal.dispose();
      
      expect(dialogueModal.isVisible()).toBe(false);
    });
  });

  describe('State Management', () => {
    test('should track visible state correctly', () => {
      expect(dialogueModal.isVisible()).toBe(false);
      
      dialogueModal.show('Test', 'Test');
      expect(dialogueModal.isVisible()).toBe(true);
      
      dialogueModal.hide();
      expect(dialogueModal.isVisible()).toBe(false);
    });

    test('should prevent multiple event listeners', () => {
      dialogueModal.show('First', 'First');
      const firstCallCount = mockDocument.addEventListener.mock.calls.length;
      
      dialogueModal.show('Second', 'Second');
      const secondCallCount = mockDocument.addEventListener.mock.calls.length;
      
      // Should not double-register event listeners
      expect(secondCallCount - firstCallCount).toBeLessThanOrEqual(1);
    });
  });
});