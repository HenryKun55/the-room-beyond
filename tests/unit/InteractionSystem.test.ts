// Mock Three.js for testing
jest.mock('three', () => ({
  Raycaster: jest.fn(() => ({
    setFromCamera: jest.fn(),
    intersectObjects: jest.fn(() => [])
  })),
  Vector2: jest.fn(() => ({ x: 0, y: 0 })),
  Vector3: jest.fn((x = 0, y = 0, z = 0) => ({
    x, y, z,
    distanceTo: jest.fn((other) => {
      const dx = x - other.x;
      const dy = y - other.y;
      const dz = z - other.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    })
  }))
}));

import { InteractionSystem } from '@systems/InteractionSystem';

describe('InteractionSystem', () => {
  let interactionSystem: InteractionSystem;
  let mockObject: any;

  beforeEach(() => {
    interactionSystem = new InteractionSystem();
    
    mockObject = {
      id: 'test_object',
      mesh: {
        userData: { interactableId: 'test_object' },
        position: { x: 0, y: 0, z: 0 }
      },
      name: 'Test Object',
      description: 'A test object',
      examined: false,
      onExamine: jest.fn(),
      highlightOnHover: true
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Object Registration', () => {
    test('should register interactable object', () => {
      interactionSystem.registerObject(mockObject);
      
      const registeredObjects = interactionSystem.getRegisteredObjects();
      expect(registeredObjects).toContain(mockObject);
    });

    test('should unregister interactable object', () => {
      interactionSystem.registerObject(mockObject);
      interactionSystem.unregisterObject(mockObject.id);
      
      const registeredObjects = interactionSystem.getRegisteredObjects();
      expect(registeredObjects).not.toContain(mockObject);
    });

    test('should find object by mesh', () => {
      interactionSystem.registerObject(mockObject);
      
      const foundObject = interactionSystem.getObjectByMesh(mockObject.mesh);
      expect(foundObject).toBe(mockObject);
    });

    test('should return null for unregistered mesh', () => {
      const unknownMesh = { userData: { interactableId: 'unknown' } };
      
      const foundObject = interactionSystem.getObjectByMesh(unknownMesh);
      expect(foundObject).toBeNull();
    });
  });

  describe('Hover Management', () => {
    test('should track currently hovered object', () => {
      interactionSystem.setHoveredObject(mockObject);
      
      expect(interactionSystem.getHoveredObject()).toBe(mockObject);
    });

    test('should clear hovered object', () => {
      interactionSystem.setHoveredObject(mockObject);
      interactionSystem.clearHoveredObject();
      
      expect(interactionSystem.getHoveredObject()).toBeNull();
    });
  });

  describe('Interaction Events', () => {
    test('should emit hover events', () => {
      const hoverCallback = jest.fn();
      interactionSystem.onHover(hoverCallback);
      
      interactionSystem.setHoveredObject(mockObject);
      
      expect(hoverCallback).toHaveBeenCalledWith(mockObject);
    });

    test('should emit unhover events', () => {
      const unhoverCallback = jest.fn();
      interactionSystem.onUnhover(unhoverCallback);
      
      interactionSystem.setHoveredObject(mockObject);
      interactionSystem.clearHoveredObject();
      
      expect(unhoverCallback).toHaveBeenCalledWith(mockObject);
    });

    test('should emit click events', () => {
      const clickCallback = jest.fn();
      interactionSystem.onClick(clickCallback);
      
      interactionSystem.handleClick(mockObject);
      
      expect(clickCallback).toHaveBeenCalledWith(mockObject);
      expect(mockObject.onExamine).toHaveBeenCalled();
    });
  });

  describe('Distance Checking', () => {
    test('should check if object is within interaction distance', () => {
      const THREE = require('three');
      const playerPosition = new THREE.Vector3(0, 0, 0);
      const objectPosition = new THREE.Vector3(1, 0, 0);
      
      mockObject.mesh.position = objectPosition;
      
      const isWithinRange = interactionSystem.isWithinInteractionDistance(
        mockObject, 
        playerPosition, 
        2.0 // max distance
      );
      
      expect(isWithinRange).toBe(true);
    });

    test('should return false if object is too far', () => {
      const THREE = require('three');
      const playerPosition = new THREE.Vector3(0, 0, 0);
      const objectPosition = new THREE.Vector3(5, 0, 0);
      
      mockObject.mesh.position = objectPosition;
      
      const isWithinRange = interactionSystem.isWithinInteractionDistance(
        mockObject, 
        playerPosition, 
        2.0 // max distance
      );
      
      expect(isWithinRange).toBe(false);
    });
  });
});