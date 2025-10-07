import * as THREE from 'three';
import { InteractableObject } from '../types/interfaces';

export class InteractionSystem {
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private registeredObjects: InteractableObject[] = [];
  private focusedObject: InteractableObject | null = null; // Single focused object
  private nearbyObjects: Set<InteractableObject> = new Set();
  
  private focusChangeCallbacks: Array<(object: InteractableObject | null, previous: InteractableObject | null) => void> = [];
  private interactionCallbacks: Array<(object: InteractableObject) => void> = [];
  private proximityEnterCallbacks: Array<(object: InteractableObject) => void> = [];
  private proximityExitCallbacks: Array<(object: InteractableObject) => void> = [];
  
  private proximityDistance: number = 3.0; // Distance for proximity detection
  private focusDistance: number = 4.0; // Maximum distance for focus

  // Center-focused interaction detection
  updateFocus(camera: THREE.Camera, playerPosition: THREE.Vector3): void {
    let bestObject: InteractableObject | null = null;
    let bestScore = Infinity;
    
    // Cast ray from center of screen
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
    // Check each nearby object for focus
    this.nearbyObjects.forEach(object => {
      const distance = playerPosition.distanceTo(object.mesh.position);
      
      // Only consider objects within focus distance
      if (distance > this.focusDistance) return;
      
      // Check if object is in the center of view using raycasting
      const intersects = this.raycaster.intersectObject(object.mesh, true);
      
      if (intersects.length > 0) {
        // Calculate angular distance from center (how close to center of screen)
        const objectScreenPos = object.mesh.position.clone().project(camera);
        const centerDistance = Math.abs(objectScreenPos.x) + Math.abs(objectScreenPos.y);
        
        // Combine distance and center alignment for scoring
        const score = distance * 0.7 + centerDistance * 2.0;
        
        if (score < bestScore) {
          bestScore = score;
          bestObject = object;
        }
      }
    });
    
    // Update focused object if it changed
    if (bestObject !== this.focusedObject) {
      this.setFocusedObject(bestObject);
    }
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

  // Focused object management (single object focus)
  setFocusedObject(object: InteractableObject | null): void {
    const previousObject = this.focusedObject;
    
    if (previousObject === object) return;
    
    // Remove highlight from previous object
    if (previousObject) {
      this.removeFocusHighlight(previousObject);
    }
    
    this.focusedObject = object;
    
    // Highlight new focused object
    if (object) {
      this.addFocusHighlight(object);
    }
    
    // Emit focus change event
    this.emitFocusChange(object, previousObject);
  }

  getFocusedObject(): InteractableObject | null {
    return this.focusedObject;
  }

  clearFocusedObject(): void {
    this.setFocusedObject(null);
  }

  // Interaction trigger (E key)
  triggerInteraction(): boolean {
    if (this.focusedObject) {
      this.handleInteraction(this.focusedObject);
      return true;
    }
    return false;
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

  private addFocusHighlight(object: InteractableObject): void {
    if (!object.highlightOnHover) return;
    
    // Create bright focus outline
    this.traverseMeshesOnly(object.mesh, (mesh) => {
      // Skip outline meshes to avoid recursion
      if (mesh.userData.isOutline) return;
      
      // Store original material if not already stored
      if (!mesh.userData.originalMaterial) {
        mesh.userData.originalMaterial = mesh.material;
      }
      
      // Create focus outline material only once
      if (!mesh.userData.focusOutlineMesh) {
        const focusOutlineMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff88, // Bright green for focused object
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.6
        });
        
        // Create slightly larger geometry for outline
        const focusOutlineMesh = new THREE.Mesh(mesh.geometry, focusOutlineMaterial);
        focusOutlineMesh.scale.set(1.08, 1.08, 1.08);
        focusOutlineMesh.userData.isOutline = true;
        
        mesh.userData.focusOutlineMesh = focusOutlineMesh;
        mesh.add(focusOutlineMesh);
      }
      
      // Make focus outline visible
      if (mesh.userData.focusOutlineMesh) {
        mesh.userData.focusOutlineMesh.visible = true;
      }
    });
  }

  private removeFocusHighlight(object: InteractableObject): void {
    this.traverseMeshesOnly(object.mesh, (mesh) => {
      // Skip outline meshes
      if (mesh.userData.isOutline) return;
      
      // Hide focus outline
      if (mesh.userData.focusOutlineMesh) {
        mesh.userData.focusOutlineMesh.visible = false;
      }
    });
  }

  private addProximityHighlight(object: InteractableObject): void {
    if (!object.highlightOnHover) return;
    
    // Create subtle proximity outline (only if not focused)
    if (object === this.focusedObject) return;
    
    this.traverseMeshesOnly(object.mesh, (mesh) => {
      // Skip outline meshes to avoid recursion
      if (mesh.userData.isOutline) return;
      
      // Store original material if not already stored
      if (!mesh.userData.originalMaterial) {
        mesh.userData.originalMaterial = mesh.material;
      }
      
      // Create proximity outline material only once
      if (!mesh.userData.proximityOutlineMesh) {
        const proximityOutlineMaterial = new THREE.MeshBasicMaterial({
          color: 0x888888, // Dim gray for nearby objects
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.2
        });
        
        // Create slightly larger geometry for outline
        const proximityOutlineMesh = new THREE.Mesh(mesh.geometry, proximityOutlineMaterial);
        proximityOutlineMesh.scale.set(1.03, 1.03, 1.03);
        proximityOutlineMesh.userData.isOutline = true;
        
        mesh.userData.proximityOutlineMesh = proximityOutlineMesh;
        mesh.add(proximityOutlineMesh);
      }
      
      // Make proximity outline visible
      if (mesh.userData.proximityOutlineMesh) {
        mesh.userData.proximityOutlineMesh.visible = true;
      }
    });
  }

  private removeProximityHighlight(object: InteractableObject): void {
    this.traverseMeshesOnly(object.mesh, (mesh) => {
      // Skip outline meshes
      if (mesh.userData.isOutline) return;
      
      // Hide proximity outline
      if (mesh.userData.proximityOutlineMesh) {
        mesh.userData.proximityOutlineMesh.visible = false;
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

  // Event handlers
  onFocusChange(callback: (object: InteractableObject | null, previous: InteractableObject | null) => void): void {
    this.focusChangeCallbacks.push(callback);
  }

  onInteraction(callback: (object: InteractableObject) => void): void {
    this.interactionCallbacks.push(callback);
  }

  onProximityEnter(callback: (object: InteractableObject) => void): void {
    this.proximityEnterCallbacks.push(callback);
  }

  onProximityExit(callback: (object: InteractableObject) => void): void {
    this.proximityExitCallbacks.push(callback);
  }

  private emitFocusChange(object: InteractableObject | null, previous: InteractableObject | null): void {
    this.focusChangeCallbacks.forEach(callback => callback(object, previous));
  }

  private emitInteraction(object: InteractableObject): void {
    this.interactionCallbacks.forEach(callback => callback(object));
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

  // Check if interaction is available
  canInteract(): boolean {
    return this.focusedObject !== null;
  }

  // Get name of focused object for UI display
  getFocusedObjectName(): string | null {
    return this.focusedObject ? this.focusedObject.name : null;
  }

  // Handle interaction (E key pressed)
  private handleInteraction(object: InteractableObject): void {
    object.onExamine();
    object.examined = true;
    this.emitInteraction(object);
  }

  // Update method for game loop
  update(deltaTime: number): void {
    // Animate focus highlight with pulsing
    if (this.focusedObject) {
      this.animateFocusHighlight(this.focusedObject, deltaTime);
    }
  }

  private animateFocusHighlight(object: InteractableObject, deltaTime: number): void {
    const time = performance.now() * 0.003; // Moderate pulsing for focus
    const opacity = 0.5 + Math.sin(time) * 0.2; // Pulse between 0.3 and 0.7
    
    this.traverseMeshesOnly(object.mesh, (mesh) => {
      if (mesh.userData.focusOutlineMesh) {
        const outlineMaterial = mesh.userData.focusOutlineMesh.material as THREE.MeshBasicMaterial;
        if (outlineMaterial) {
          outlineMaterial.opacity = opacity;
        }
      }
    });
  }

  // Dispose method for cleanup
  dispose(): void {
    this.clearFocusedObject();
    
    // Clear all proximity highlights
    this.nearbyObjects.forEach(object => {
      this.removeProximityHighlight(object);
    });
    
    this.registeredObjects = [];
    this.nearbyObjects.clear();
    this.focusChangeCallbacks = [];
    this.interactionCallbacks = [];
    this.proximityEnterCallbacks = [];
    this.proximityExitCallbacks = [];
  }
}