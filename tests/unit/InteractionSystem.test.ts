// Mock Three.js for testing
jest.mock('three', () => ({
  Raycaster: jest.fn(() => ({
    setFromCamera: jest.fn(),
    intersectObjects: jest.fn(() => []),
    intersectObject: jest.fn(() => [{ distance: 1, object: {} }])
  })),
  Vector2: jest.fn((x = 0, y = 0) => ({ x, y })),
  Vector3: jest.fn((x = 0, y = 0, z = 0) => ({
    x, y, z,
    distanceTo: jest.fn((other) => {
      const dx = x - other.x;
      const dy = y - other.y;
      const dz = z - other.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }),
    clone: jest.fn(() => ({ x, y, z, project: jest.fn(() => ({ x: 0, y: 0 })) }))
  })),
  MeshBasicMaterial: jest.fn(() => ({
    color: 0xffffff,
    side: 0,
    transparent: false,
    opacity: 1
  })),
  Mesh: jest.fn(() => ({
    geometry: {},
    material: {},
    scale: { set: jest.fn() },
    userData: {},
    add: jest.fn(),
    visible: true
  })),
  BackSide: 1
}));

import { InteractionSystem } from '@systems/InteractionSystem';

describe('InteractionSystem', () => {
  let interactionSystem: InteractionSystem;
  let mockObject: any;

  beforeEach(() => {
    interactionSystem = new InteractionSystem();
    
    const THREE = require('three');
    mockObject = {
      id: 'test_object',
      mesh: {
        userData: { interactableId: 'test_object' },
        position: new THREE.Vector3(0, 0, 0),
        type: 'Mesh',
        children: [],
        material: {},
        geometry: {},
        add: jest.fn(),
        remove: jest.fn()
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

  describe('Focus Management', () => {
    test('should track currently focused object', () => {
      interactionSystem.setFocusedObject(mockObject);
      
      expect(interactionSystem.getFocusedObject()).toBe(mockObject);
    });

    test('should clear focused object', () => {
      interactionSystem.setFocusedObject(mockObject);
      interactionSystem.clearFocusedObject();
      
      expect(interactionSystem.getFocusedObject()).toBeNull();
    });

    test('should check if interaction is available', () => {
      expect(interactionSystem.canInteract()).toBe(false);
      
      interactionSystem.setFocusedObject(mockObject);
      expect(interactionSystem.canInteract()).toBe(true);
      
      interactionSystem.clearFocusedObject();
      expect(interactionSystem.canInteract()).toBe(false);
    });

    test('should get focused object name', () => {
      expect(interactionSystem.getFocusedObjectName()).toBeNull();
      
      interactionSystem.setFocusedObject(mockObject);
      expect(interactionSystem.getFocusedObjectName()).toBe('Test Object');
    });
  });

  describe('Interaction Events', () => {
    test('should emit focus change events', () => {
      const focusCallback = jest.fn();
      interactionSystem.onFocusChange(focusCallback);
      
      interactionSystem.setFocusedObject(mockObject);
      
      expect(focusCallback).toHaveBeenCalledWith(mockObject, null);
    });

    test('should emit proximity enter events', () => {
      const proximityEnterCallback = jest.fn();
      interactionSystem.onProximityEnter(proximityEnterCallback);
      
      const THREE = require('three');
      const playerPosition = new THREE.Vector3(0, 0, 0);
      mockObject.mesh.position = new THREE.Vector3(1, 0, 0); // Within proximity distance
      
      interactionSystem.registerObject(mockObject);
      interactionSystem.checkProximity(playerPosition);
      
      expect(proximityEnterCallback).toHaveBeenCalledWith(mockObject);
    });

    test('should emit proximity exit events', () => {
      const proximityExitCallback = jest.fn();
      interactionSystem.onProximityExit(proximityExitCallback);
      
      const THREE = require('three');
      const playerPosition = new THREE.Vector3(0, 0, 0);
      
      // First, get object into proximity
      mockObject.mesh.position = new THREE.Vector3(1, 0, 0);
      interactionSystem.registerObject(mockObject);
      interactionSystem.checkProximity(playerPosition);
      
      // Then move it out of proximity
      mockObject.mesh.position = new THREE.Vector3(10, 0, 0);
      interactionSystem.checkProximity(playerPosition);
      
      expect(proximityExitCallback).toHaveBeenCalledWith(mockObject);
    });

    test('should trigger interaction with E key', () => {
      const interactionCallback = jest.fn();
      interactionSystem.onInteraction(interactionCallback);
      
      // No focused object - should return false
      expect(interactionSystem.triggerInteraction()).toBe(false);
      
      // With focused object - should trigger interaction
      interactionSystem.setFocusedObject(mockObject);
      expect(interactionSystem.triggerInteraction()).toBe(true);
      
      expect(mockObject.onExamine).toHaveBeenCalled();
      expect(mockObject.examined).toBe(true);
      expect(interactionCallback).toHaveBeenCalledWith(mockObject);
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