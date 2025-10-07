import * as THREE from 'three';
import { InteractableObject } from '../types/interfaces';

export class InteractionSystem {
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private registeredObjects: InteractableObject[] = [];
  private hoveredObject: InteractableObject | null = null;
  
  private hoverCallbacks: Array<(object: InteractableObject) => void> = [];
  private unhoverCallbacks: Array<(object: InteractableObject) => void> = [];
  private clickCallbacks: Array<(object: InteractableObject) => void> = [];

  // Raycasting and interaction detection
  checkInteraction(
    camera: THREE.Camera,
    mouseX: number,
    mouseY: number,
    interactables: THREE.Object3D[]
  ): InteractableObject | null {
    // Convert mouse position to normalized device coordinates
    this.mouse.x = (mouseX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(mouseY / window.innerHeight) * 2 + 1;
    
    // Cast ray from camera
    this.raycaster.setFromCamera(this.mouse, camera);
    
    // Check for intersections
    const intersects = this.raycaster.intersectObjects(interactables, true);
    
    if (intersects.length > 0) {
      return this.getObjectByMesh(intersects[0].object);
    }
    
    return null;
  }

  // Object highlighting
  highlightObject(object: InteractableObject): void {
    if (!object.highlightOnHover) return;
    
    // Store original material if not already stored
    const mesh = object.mesh as THREE.Mesh;
    if (mesh.material && !mesh.userData.originalMaterial) {
      mesh.userData.originalMaterial = mesh.material;
    }
    
    // Apply highlight effect
    if (mesh.material) {
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material.emissive) {
        mesh.userData.originalEmissive = material.emissive.getHex();
        material.emissive.setHex(0x333333);
        material.emissiveIntensity = 0.2;
      }
    }
  }

  removeHighlight(object: InteractableObject): void {
    const mesh = object.mesh as THREE.Mesh;
    if (mesh.userData.originalMaterial && mesh.material) {
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material.emissive && mesh.userData.originalEmissive !== undefined) {
        material.emissive.setHex(mesh.userData.originalEmissive);
        material.emissiveIntensity = 0;
      }
    }
  }

  // Hovered object management
  setHoveredObject(object: InteractableObject | null): void {
    if (this.hoveredObject === object) return;
    
    // Remove highlight from previous object
    if (this.hoveredObject) {
      this.removeHighlight(this.hoveredObject);
      this.emitUnhover(this.hoveredObject);
    }
    
    this.hoveredObject = object;
    
    // Highlight new object
    if (object) {
      this.highlightObject(object);
      this.emitHover(object);
    }
  }

  getHoveredObject(): InteractableObject | null {
    return this.hoveredObject;
  }

  clearHoveredObject(): void {
    this.setHoveredObject(null);
  }

  // Object registration
  registerObject(object: InteractableObject): void {
    if (!this.registeredObjects.includes(object)) {
      this.registeredObjects.push(object);
    }
  }

  unregisterObject(objectId: string): void {
    this.registeredObjects = this.registeredObjects.filter(obj => obj.id !== objectId);
  }

  getRegisteredObjects(): InteractableObject[] {
    return [...this.registeredObjects];
  }

  getObjectByMesh(mesh: any): InteractableObject | null {
    // Check if mesh has userData with interactableId
    if (mesh.userData && mesh.userData.interactableId) {
      return this.registeredObjects.find(obj => obj.id === mesh.userData.interactableId) || null;
    }
    
    // Fallback: check by mesh reference
    return this.registeredObjects.find(obj => obj.mesh === mesh) || null;
  }

  // Event handling
  onHover(callback: (object: InteractableObject) => void): void {
    this.hoverCallbacks.push(callback);
  }

  onUnhover(callback: (object: InteractableObject) => void): void {
    this.unhoverCallbacks.push(callback);
  }

  onClick(callback: (object: InteractableObject) => void): void {
    this.clickCallbacks.push(callback);
  }

  private emitHover(object: InteractableObject): void {
    this.hoverCallbacks.forEach(callback => callback(object));
  }

  private emitUnhover(object: InteractableObject): void {
    this.unhoverCallbacks.forEach(callback => callback(object));
  }

  private emitClick(object: InteractableObject): void {
    this.clickCallbacks.forEach(callback => callback(object));
  }

  // Click handling
  handleClick(object: InteractableObject): void {
    object.onExamine();
    object.examined = true;
    this.emitClick(object);
  }

  // Distance checking
  isWithinInteractionDistance(
    object: InteractableObject, 
    playerPosition: THREE.Vector3, 
    maxDistance: number = 3.0
  ): boolean {
    const objectPosition = object.mesh.position;
    const distance = playerPosition.distanceTo(objectPosition);
    return distance <= maxDistance;
  }

  // Update method for game loop
  update(deltaTime: number): void {
    // Any per-frame updates for interaction system
    // Could include animation of highlighted objects, etc.
  }

  // Dispose method for cleanup
  dispose(): void {
    this.clearHoveredObject();
    this.registeredObjects = [];
    this.hoverCallbacks = [];
    this.unhoverCallbacks = [];
    this.clickCallbacks = [];
  }
}