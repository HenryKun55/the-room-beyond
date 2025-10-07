import * as THREE from 'three';
import { InputHandler } from '@core/InputHandler';

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private inputHandler: InputHandler;
  private canvas: HTMLCanvasElement;
  
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private direction: THREE.Vector3 = new THREE.Vector3();
  private right: THREE.Vector3 = new THREE.Vector3();
  private up: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  
  private yaw: number = 0;
  private pitch: number = 0;
  private mouseSensitivity: number = 0.002;
  private moveSpeed: number = 5.0;
  private maxPitch: number = Math.PI / 2 - 0.1;
  
  private isPointerLocked: boolean = false;
  private previousMouseX: number = 0;
  private previousMouseY: number = 0;
  
  // Collision detection
  private collisionObjects: THREE.Object3D[] = [];
  private playerRadius: number = 0.3;
  private roomBounds = { x: 3.8, z: 3.8 }; // Room is 8x8, so bounds are ±3.8

  constructor(camera: THREE.PerspectiveCamera, inputHandler: InputHandler, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.inputHandler = inputHandler;
    this.canvas = canvas;
    
    this.setupPointerLock();
    this.setupMouseMovement();
  }

  private setupPointerLock(): void {
    // Request pointer lock on canvas click
    this.canvas.addEventListener('click', () => {
      if (!this.isPointerLocked) {
        this.canvas.requestPointerLock();
      }
    });

    // Handle pointer lock change
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.canvas;
      
      if (this.isPointerLocked) {
        this.canvas.style.cursor = 'none';
        console.log('Pointer locked - use mouse to look around, WASD to move, ESC to unlock');
      } else {
        this.canvas.style.cursor = 'crosshair';
        console.log('Pointer unlocked - click to re-lock');
      }
    });

    // Handle escape key to exit pointer lock
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isPointerLocked) {
        document.exitPointerLock();
      }
    });
  }

  private setupMouseMovement(): void {
    document.addEventListener('mousemove', (event) => {
      if (!this.isPointerLocked) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      this.yaw -= movementX * this.mouseSensitivity;
      this.pitch -= movementY * this.mouseSensitivity;

      // Clamp pitch to prevent over-rotation
      this.pitch = Math.max(-this.maxPitch, Math.min(this.maxPitch, this.pitch));

      this.updateCameraRotation();
    });
  }

  private updateCameraRotation(): void {
    // Create rotation quaternion from yaw and pitch
    const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(this.up, this.yaw);
    const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch);
    
    // Combine rotations
    const rotation = new THREE.Quaternion().multiplyQuaternions(yawQuaternion, pitchQuaternion);
    this.camera.quaternion.copy(rotation);

    // Update direction vectors
    this.camera.getWorldDirection(this.direction);
    this.right.crossVectors(this.direction, this.up).normalize();
  }

  update(deltaTime: number): void {
    const deltaSeconds = deltaTime / 1000;
    
    // Reset velocity
    this.velocity.set(0, 0, 0);

    // Calculate movement based on input
    if (this.inputHandler.isKeyPressed('w')) {
      this.velocity.add(this.direction);
    }
    if (this.inputHandler.isKeyPressed('s')) {
      this.velocity.sub(this.direction);
    }
    if (this.inputHandler.isKeyPressed('a')) {
      this.velocity.sub(this.right);
    }
    if (this.inputHandler.isKeyPressed('d')) {
      this.velocity.add(this.right);
    }

    // Normalize velocity and apply speed
    if (this.velocity.length() > 0) {
      this.velocity.normalize();
      this.velocity.multiplyScalar(this.moveSpeed * deltaSeconds);
      
      // Calculate new position
      const newPosition = this.camera.position.clone();
      newPosition.add(this.velocity);
      newPosition.y = 1.6; // Keep at eye level
      
      // Check for collisions before moving
      if (!this.checkCollision(newPosition)) {
        this.camera.position.copy(newPosition);
      }
    }
  }

  getPosition(): THREE.Vector3 {
    return this.camera.position.clone();
  }

  getDirection(): THREE.Vector3 {
    return this.direction.clone();
  }

  setPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
  }

  setRotation(yaw: number, pitch: number): void {
    this.yaw = yaw;
    this.pitch = Math.max(-this.maxPitch, Math.min(this.maxPitch, pitch));
    this.updateCameraRotation();
  }

  // Collision Detection Methods
  addCollisionObject(object: THREE.Object3D): void {
    this.collisionObjects.push(object);
  }

  private checkCollision(position: THREE.Vector3): boolean {
    // Check room bounds (walls)
    if (Math.abs(position.x) > this.roomBounds.x || 
        Math.abs(position.z) > this.roomBounds.z) {
      return true; // Collision with walls
    }

    // Check collision with objects
    for (const obj of this.collisionObjects) {
      if (this.checkObjectCollision(position, obj)) {
        return true;
      }
    }

    return false; // No collision
  }

  private checkObjectCollision(position: THREE.Vector3, object: THREE.Object3D): boolean {
    // Get object's bounding box
    const box = new THREE.Box3().setFromObject(object);
    
    // Expand the box by player radius for collision
    box.expandByScalar(this.playerRadius);
    
    // Check if player position is inside the expanded box
    return box.containsPoint(position);
  }

  // Method to set collision objects from the scene
  setCollisionObjects(objects: THREE.Object3D[]): void {
    this.collisionObjects = [...objects];
  }

  dispose(): void {
    if (document.pointerLockElement === this.canvas) {
      document.exitPointerLock();
    }
  }
}