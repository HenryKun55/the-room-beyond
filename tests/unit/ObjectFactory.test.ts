// Mock Three.js for testing
jest.mock('three', () => ({
  BoxGeometry: jest.fn(() => ({ type: 'BoxGeometry' })),
  CylinderGeometry: jest.fn(() => ({ type: 'CylinderGeometry' })),
  SphereGeometry: jest.fn(() => ({ type: 'SphereGeometry' })),
  PlaneGeometry: jest.fn(() => ({ type: 'PlaneGeometry' })),
  MeshStandardMaterial: jest.fn(() => ({
    type: 'MeshStandardMaterial',
    color: { setHex: jest.fn() },
    metalness: 0,
    roughness: 1
  })),
  Mesh: jest.fn((geometry, material) => ({
    type: 'Mesh',
    geometry,
    material,
    position: { set: jest.fn(), x: 0, y: 0, z: 0 },
    rotation: { set: jest.fn(), x: 0, y: 0, z: 0 },
    scale: { set: jest.fn(), x: 1, y: 1, z: 1 },
    userData: {},
    castShadow: false,
    receiveShadow: false
  })),
  Group: jest.fn(() => ({
    type: 'Group',
    add: jest.fn(),
    position: { set: jest.fn(), x: 0, y: 0, z: 0 },
    rotation: { set: jest.fn(), x: 0, y: 0, z: 0 },
    scale: { set: jest.fn(), x: 1, y: 1, z: 1 },
    userData: {}
  })),
  Color: jest.fn((color) => ({
    setHex: jest.fn(),
    getHex: jest.fn(() => color)
  }))
}));

import { ObjectFactory } from '@core/ObjectFactory';
import { InteractableObject } from '../types/interfaces';

describe('ObjectFactory', () => {
  let objectFactory: ObjectFactory;

  beforeEach(() => {
    objectFactory = new ObjectFactory();
    jest.clearAllMocks();
  });

  describe('Phone Creation', () => {
    test('should create phone with correct properties', () => {
      const phone = objectFactory.createPhone('test_phone', 0, 1, 0);
      
      expect(phone.id).toBe('test_phone');
      expect(phone.name).toBe('Phone');
      expect(phone.description).toContain('phone');
      expect(phone.mesh.position.set).toHaveBeenCalledWith(0, 1, 0);
      expect(phone.mesh.userData.interactableId).toBe('test_phone');
      expect(phone.examined).toBe(false);
      expect(phone.highlightOnHover).toBe(true);
    });

    test('should create phone with screen and body parts', () => {
      const phone = objectFactory.createPhone('phone', 0, 0, 0);
      
      // Should call Group.add for screen and body
      expect(phone.mesh.add).toHaveBeenCalledTimes(2);
    });

    test('should have working onExamine callback', () => {
      const phone = objectFactory.createPhone('phone', 0, 0, 0);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      phone.onExamine();
      
      expect(consoleSpy).toHaveBeenCalledWith('My phone sits silent on the desk, its black screen reflecting nothing. I haven\'t touched it in hours - the constant buzzing and notifications felt overwhelming today.');
      consoleSpy.mockRestore();
    });
  });

  describe('Laptop Creation', () => {
    test('should create laptop with correct properties', () => {
      const laptop = objectFactory.createLaptop('test_laptop', 1, 0, 1);
      
      expect(laptop.id).toBe('test_laptop');
      expect(laptop.name).toBe('Laptop');
      expect(laptop.description).toContain('laptop');
      expect(laptop.mesh.position.set).toHaveBeenCalledWith(1, 0, 1);
      expect(laptop.mesh.userData.interactableId).toBe('test_laptop');
    });

    test('should create laptop with multiple components', () => {
      const laptop = objectFactory.createLaptop('laptop', 0, 0, 0);
      
      // Should call Group.add for base and screen
      expect(laptop.mesh.add).toHaveBeenCalledTimes(2);
    });

    test('should have working onExamine callback', () => {
      const laptop = objectFactory.createLaptop('laptop', 0, 0, 0);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      laptop.onExamine();
      
      expect(consoleSpy).toHaveBeenCalledWith('My laptop waits patiently, closed and silver. Behind that screen are emails I haven\'t answered, deadlines I\'m avoiding, and a world that feels too demanding right now.');
      consoleSpy.mockRestore();
    });
  });

  describe('VR Headset Creation', () => {
    test('should create VR headset with correct properties', () => {
      const vr = objectFactory.createVRHeadset('test_vr', -1, 0.5, 0);
      
      expect(vr.id).toBe('test_vr');
      expect(vr.name).toBe('VR Headset');
      expect(vr.description).toContain('VR headset');
      expect(vr.mesh.position.set).toHaveBeenCalledWith(-1, 0.5, 0);
      expect(vr.mesh.userData.interactableId).toBe('test_vr');
    });

    test('should create VR headset with headset and strap', () => {
      const vr = objectFactory.createVRHeadset('vr', 0, 0, 0);
      
      // Should call Group.add for headset and strap
      expect(vr.mesh.add).toHaveBeenCalledTimes(2);
    });

    test('should have working onExamine callback', () => {
      const vr = objectFactory.createVRHeadset('vr', 0, 0, 0);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      vr.onExamine();
      
      expect(consoleSpy).toHaveBeenCalledWith('The VR headset offers escape to anywhere but here. Virtual worlds where I can be anyone, go anywhere - where anxiety doesn\'t follow me. But when I take it off, I\'m still in this room.');
      consoleSpy.mockRestore();
    });
  });

  describe('Alarm Clock Creation', () => {
    test('should create alarm clock with correct properties', () => {
      const clock = objectFactory.createAlarmClock('test_clock', 2, 1, -1);
      
      expect(clock.id).toBe('test_clock');
      expect(clock.name).toBe('Alarm Clock');
      expect(clock.description).toContain('alarm clock');
      expect(clock.mesh.position.set).toHaveBeenCalledWith(2, 1, -1);
      expect(clock.mesh.userData.interactableId).toBe('test_clock');
    });

    test('should create alarm clock with body and display', () => {
      const clock = objectFactory.createAlarmClock('clock', 0, 0, 0);
      
      // Should call Group.add for body and display
      expect(clock.mesh.add).toHaveBeenCalledTimes(2);
    });

    test('should have working onExamine callback', () => {
      const clock = objectFactory.createAlarmClock('clock', 0, 0, 0);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      clock.onExamine();
      
      expect(consoleSpy).toHaveBeenCalledWith('The alarm clock\'s red digits stare back at me: 3:47. AM or PM? Time has lost meaning when every day blends into the next. I should set an alarm, but for what?');
      consoleSpy.mockRestore();
    });
  });

  describe('Furniture Creation', () => {
    test('should create desk with correct properties', () => {
      const desk = objectFactory.createDesk('test_desk', 0, 0, 0);
      
      expect(desk.id).toBe('test_desk');
      expect(desk.name).toBe('Desk');
      expect(desk.description).toContain('desk');
      expect(desk.mesh.position.set).toHaveBeenCalledWith(0, 0, 0);
      expect(desk.mesh.userData.interactableId).toBe('test_desk');
    });

    test('should create bed with correct properties', () => {
      const bed = objectFactory.createBed('test_bed', 0, 0, 0);
      
      expect(bed.id).toBe('test_bed');
      expect(bed.name).toBe('Bed');
      expect(bed.description).toContain('bed');
      expect(bed.mesh.position.set).toHaveBeenCalledWith(0, 0, 0);
      expect(bed.mesh.userData.interactableId).toBe('test_bed');
    });

    test('should create chair with correct properties', () => {
      const chair = objectFactory.createChair('test_chair', 1, 0, 1);
      
      expect(chair.id).toBe('test_chair');
      expect(chair.name).toBe('Chair');
      expect(chair.description).toContain('chair');
      expect(chair.mesh.position.set).toHaveBeenCalledWith(1, 0, 1);
      expect(chair.mesh.userData.interactableId).toBe('test_chair');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid positions gracefully', () => {
      expect(() => {
        objectFactory.createPhone('phone', NaN, 0, 0);
      }).not.toThrow();
    });

    test('should handle empty id strings', () => {
      expect(() => {
        objectFactory.createLaptop('', 0, 0, 0);
      }).not.toThrow();
    });
  });

  describe('Object Consistency', () => {
    test('all created objects should implement InteractableObject interface', () => {
      const objects = [
        objectFactory.createPhone('phone', 0, 0, 0),
        objectFactory.createLaptop('laptop', 0, 0, 0),
        objectFactory.createVRHeadset('vr', 0, 0, 0),
        objectFactory.createAlarmClock('clock', 0, 0, 0),
        objectFactory.createDesk('desk', 0, 0, 0),
        objectFactory.createBed('bed', 0, 0, 0),
        objectFactory.createChair('chair', 0, 0, 0)
      ];

      objects.forEach(obj => {
        expect(obj).toHaveProperty('id');
        expect(obj).toHaveProperty('mesh');
        expect(obj).toHaveProperty('name');
        expect(obj).toHaveProperty('description');
        expect(obj).toHaveProperty('examined');
        expect(obj).toHaveProperty('onExamine');
        expect(obj).toHaveProperty('highlightOnHover');
        expect(typeof obj.onExamine).toBe('function');
      });
    });

    test('should create objects with unique mesh references', () => {
      const phone1 = objectFactory.createPhone('phone1', 0, 0, 0);
      const phone2 = objectFactory.createPhone('phone2', 1, 0, 0);
      
      expect(phone1.mesh).not.toBe(phone2.mesh);
    });
  });
});