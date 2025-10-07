import * as THREE from 'three';
import { InteractableObject } from '../types/interfaces';

export class InteractionSystem {
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private registeredObjects: InteractableObject[] = [];
  private hoveredObject: InteractableObject | null = null;
  private nearbyObjects: Set<InteractableObject> = new Set();
  
  private hoverCallbacks: Array<(object: InteractableObject) => void> = [];
  private unhoverCallbacks: Array<(object: InteractableObject) => void> = [];
  private clickCallbacks: Array<(object: InteractableObject) => void> = [];
  private proximityEnterCallbacks: Array<(object: InteractableObject) => void> = [];
  private proximityExitCallbacks: Array<(object: InteractableObject) => void> = [];
  
  private proximityDistance: number = 2.0; // Distance for proximity detection

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

  // Proximity Detection
  checkProximity(playerPosition: THREE.Vector3): void {
    const currentNearby = new Set<InteractableObject>();
    
    // Check each object for proximity
    this.registeredObjects.forEach(object => {
      const distance = playerPosition.distanceTo(object.mesh.position);
      
      if (distance <= this.proximityDistance) {
        currentNearby.add(object);
        
        // If object just entered proximity
        if (!this.nearbyObjects.has(object)) {
          this.addProximityHighlight(object);
          this.emitProximityEnter(object);
        }
      }
    });
    
    // Check for objects that left proximity
    this.nearbyObjects.forEach(object => {
      if (!currentNearby.has(object)) {
        this.removeProximityHighlight(object);
        this.emitProximityExit(object);
      }
    });
    
    // Update nearby objects set
    this.nearbyObjects = currentNearby;
  }

  private addProximityHighlight(object: InteractableObject): void {
    if (!object.highlightOnHover) return;
    
    // Create outline effect using edge geometry
    this.traverseMeshesOnly(object.mesh, (mesh) => {
      // Skip outline meshes to avoid recursion
      if (mesh.userData.isOutline) return;
      
      // Store original material if not already stored
      if (!mesh.userData.originalMaterial) {
        mesh.userData.originalMaterial = mesh.material;
      }
      
      // Create outline material only once
      if (!mesh.userData.outlineMesh) {
        const outlineMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff88,
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.3
        });
        
        // Create slightly larger geometry for outline
        const outlineMesh = new THREE.Mesh(mesh.geometry, outlineMaterial);
        outlineMesh.scale.set(1.05, 1.05, 1.05);
        outlineMesh.userData.isOutline = true;
        
        mesh.userData.outlineMesh = outlineMesh;
        mesh.add(outlineMesh);
      }
      
      // Make outline visible
      if (mesh.userData.outlineMesh) {
        mesh.userData.outlineMesh.visible = true;
      }
    });
  }

  private removeProximityHighlight(object: InteractableObject): void {
    this.traverseMeshesOnly(object.mesh, (mesh) => {
      // Skip outline meshes
      if (mesh.userData.isOutline) return;
      
      // Hide outline
      if (mesh.userData.outlineMesh) {
        mesh.userData.outlineMesh.visible = false;
      }
    });
  }

  // Helper method to traverse only mesh objects and avoid recursion
  private traverseMeshesOnly(object: THREE.Object3D, callback: (mesh: THREE.Mesh) => void): void {
    if (object.type === 'Mesh' && !object.userData.isOutline) {
      callback(object as THREE.Mesh);
    }
    
    // Only traverse direct children, not outline meshes
    for (const child of object.children) {
      if (!child.userData.isOutline) {
        this.traverseMeshesOnly(child, callback);
      }
    }
  }

  // Event handlers for proximity
  onProximityEnter(callback: (object: InteractableObject) => void): void {
    this.proximityEnterCallbacks.push(callback);
  }

  onProximityExit(callback: (object: InteractableObject) => void): void {
    this.proximityExitCallbacks.push(callback);
  }

  private emitProximityEnter(object: InteractableObject): void {
    this.proximityEnterCallbacks.forEach(callback => callback(object));
  }

  private emitProximityExit(object: InteractableObject): void {
    this.proximityExitCallbacks.forEach(callback => callback(object));
  }

  getNearbyObjects(): InteractableObject[] {
    return Array.from(this.nearbyObjects);
  }

  // Update method for game loop
  update(deltaTime: number): void {
    // Any per-frame updates for interaction system
    // Could include animation of highlighted objects, etc.
  }

  // Dispose method for cleanup
  dispose(): void {
    this.clearHoveredObject();
    
    // Clear all proximity highlights
    this.nearbyObjects.forEach(object => {
      this.removeProximityHighlight(object);
    });
    
    this.registeredObjects = [];
    this.nearbyObjects.clear();
    this.hoverCallbacks = [];
    this.unhoverCallbacks = [];
    this.clickCallbacks = [];
    this.proximityEnterCallbacks = [];
    this.proximityExitCallbacks = [];
  }
}