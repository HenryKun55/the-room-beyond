import { StorySystem } from '@systems/StorySystem';

describe('StorySystem', () => {
  let storySystem: StorySystem;

  beforeEach(() => {
    storySystem = new StorySystem();
  });

  describe('Flag Management', () => {
    test('should set and get flags', () => {
      storySystem.setFlag('test_flag', true);
      expect(storySystem.getFlag('test_flag')).toBe(true);
    });

    test('should support different flag types', () => {
      storySystem.setFlag('bool_flag', true);
      storySystem.setFlag('number_flag', 42);
      storySystem.setFlag('string_flag', 'hello');

      expect(storySystem.getFlag('bool_flag')).toBe(true);
      expect(storySystem.getFlag('number_flag')).toBe(42);
      expect(storySystem.getFlag('string_flag')).toBe('hello');
    });

    test('should return undefined for non-existent flags', () => {
      expect(storySystem.getFlag('non_existent')).toBeUndefined();
    });

    test('should update existing flags', () => {
      storySystem.setFlag('counter', 1);
      storySystem.setFlag('counter', 2);
      expect(storySystem.getFlag('counter')).toBe(2);
    });
  });

  describe('Object Discovery', () => {
    test('should mark object as discovered', () => {
      storySystem.discoverObject('phone');
      expect(storySystem.isDiscovered('phone')).toBe(true);
    });

    test('should not discover same object twice', () => {
      storySystem.discoverObject('phone');
      storySystem.discoverObject('phone');
      expect(storySystem.getDiscoveredCount()).toBe(1);
    });

    test('should track multiple discoveries', () => {
      storySystem.discoverObject('phone');
      storySystem.discoverObject('laptop');
      storySystem.discoverObject('journal');
      expect(storySystem.getDiscoveredCount()).toBe(3);
    });

    test('should return false for undiscovered objects', () => {
      expect(storySystem.isDiscovered('mystery_item')).toBe(false);
    });
  });

  describe('Act Progression', () => {
    test('should start at Act 1', () => {
      expect(storySystem.getCurrentAct()).toBe(1);
    });

    test('should transition to Act 2 after 3 discoveries', () => {
      storySystem.discoverObject('alarm_clock');
      storySystem.discoverObject('phone');
      storySystem.discoverObject('medicine');

      expect(storySystem.getFlag('act1_complete')).toBe(true);
      expect(storySystem.canProgressToNextAct()).toBe(true);
    });

    test('should transition to Act 3 after finding critical items', () => {
      // Setup Act 2 complete
      storySystem.transitionToAct(2); // First transition to Act 2
      storySystem.setFlag('laptop_accessed', true);
      storySystem.setFlag('vr_examined', true);
      storySystem.setFlag('photo_examined', true);

      storySystem.checkActProgression();
      
      expect(storySystem.getFlag('act2_complete')).toBe(true);
    });

    test('should manually transition acts', () => {
      storySystem.transitionToAct(2);
      expect(storySystem.getCurrentAct()).toBe(2);
    });

    test('should not allow skipping acts', () => {
      expect(() => storySystem.transitionToAct(3)).toThrow();
    });
  });

  describe('Story Events', () => {
    test('should emit events on flag changes', () => {
      const callback = jest.fn();
      storySystem.on('flagChanged', callback);

      storySystem.setFlag('test', true);

      expect(callback).toHaveBeenCalledWith({
        flag: 'test',
        value: true
      });
    });

    test('should emit events on discovery', () => {
      const callback = jest.fn();
      storySystem.on('objectDiscovered', callback);

      storySystem.discoverObject('phone');

      expect(callback).toHaveBeenCalledWith({
        objectId: 'phone',
        totalDiscovered: 1
      });
    });

    test('should emit events on act transition', () => {
      const callback = jest.fn();
      storySystem.on('actChanged', callback);

      storySystem.transitionToAct(2);

      expect(callback).toHaveBeenCalledWith({
        previousAct: 1,
        currentAct: 2
      });
    });
  });

  describe('Save/Load State', () => {
    test('should export state', () => {
      storySystem.setFlag('test', true);
      storySystem.discoverObject('phone');

      const state = storySystem.exportState();

      expect(state.flags.test).toBe(true);
      expect(state.discoveredObjects).toContain('phone');
      expect(state.currentAct).toBe(1);
    });

    test('should import state', () => {
      const state = {
        flags: { test: true, count: 5 },
        discoveredObjects: ['phone', 'laptop'],
        currentAct: 2
      };

      storySystem.importState(state);

      expect(storySystem.getFlag('test')).toBe(true);
      expect(storySystem.getFlag('count')).toBe(5);
      expect(storySystem.isDiscovered('phone')).toBe(true);
      expect(storySystem.getCurrentAct()).toBe(2);
    });
  });
});