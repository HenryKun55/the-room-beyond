import * as THREE from 'three';

export interface RoomStructure {
  walls: THREE.Mesh[];
  floor: THREE.Mesh;
  ceiling: THREE.Mesh;
}

export interface EnvironmentalDetails {
  trashItems: THREE.Mesh[];
  wallStain: THREE.Mesh;
}

export class RoomFactory {
  constructor(private useTextures: boolean = true) {}

  createRoomStructure(): RoomStructure {
    const wallTexture = this.useTextures ? this.createWallTexture() : null;
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4a4a4a,
      map: wallTexture,
      roughness: 0.8,
      metalness: 0.0
    });
    
    // Create walls
    const walls: THREE.Mesh[] = [];
    
    // Front wall
    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), wallMaterial);
    frontWall.position.set(0, 2, -4);
    frontWall.receiveShadow = true;
    walls.push(frontWall);
    
    // Back wall with slight discoloration
    const backWallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x424242,
      map: wallTexture,
      roughness: 0.9,
      metalness: 0.0
    });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), backWallMaterial);
    backWall.position.set(0, 2, 4);
    backWall.rotation.y = Math.PI;
    backWall.receiveShadow = true;
    walls.push(backWall);
    
    // Left wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), wallMaterial);
    leftWall.position.set(-4, 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    walls.push(leftWall);
    
    // Right wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), wallMaterial);
    rightWall.position.set(4, 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    walls.push(rightWall);
    
    // Floor
    const floorTexture = this.useTextures ? this.createFloorTexture() : null;
    const floorGeometry = new THREE.PlaneGeometry(8, 8);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3a3a3a,
      map: floorTexture,
      roughness: 0.95,
      metalness: 0.0
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.01;
    floor.receiveShadow = true;
    
    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(8, 8);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x353535,
      roughness: 0.9
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 3.8;
    
    return { walls, floor, ceiling };
  }

  createEnvironmentalDetails(): EnvironmentalDetails {
    const trashMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const trashItems: THREE.Mesh[] = [];
    
    // Small trash items
    for (let i = 0; i < 5; i++) {
      const trash = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.05, 0.1), 
        trashMaterial
      );
      trash.position.set(
        (Math.random() - 0.5) * 6,
        0.05,
        (Math.random() - 0.5) * 6
      );
      trash.rotation.y = Math.random() * Math.PI;
      trashItems.push(trash);
    }
    
    // Wall stain
    const stainMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a, 
      transparent: true, 
      opacity: 0.3 
    });
    const wallStain = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 1.2),
      stainMaterial
    );
    wallStain.position.set(-3.95, 1.5, 2);
    wallStain.rotation.y = Math.PI / 2;
    
    return { trashItems, wallStain };
  }

  addToScene(scene: THREE.Scene): void {
    const roomStructure = this.createRoomStructure();
    const environmentalDetails = this.createEnvironmentalDetails();
    
    // Add walls
    roomStructure.walls.forEach(wall => scene.add(wall));
    
    // Add floor and ceiling
    scene.add(roomStructure.floor);
    scene.add(roomStructure.ceiling);
    
    // Add environmental details
    environmentalDetails.trashItems.forEach(trash => scene.add(trash));
    scene.add(environmentalDetails.wallStain);
  }

  private createWallTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base wall color
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add some noise/texture
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const opacity = Math.random() * 0.1;
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, ${opacity})`;
      ctx.fillRect(x, y, 2, 2);
    }
    
    // Add some stains
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 30 + 10;
      ctx.fillStyle = `rgba(30, 25, 20, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  private createFloorTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base floor color - darker
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add dirt and wear patterns
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const opacity = Math.random() * 0.2;
      ctx.fillStyle = `rgba(${40 + Math.random() * 20}, ${35 + Math.random() * 15}, ${30 + Math.random() * 15}, ${opacity})`;
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Add larger stains
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 40 + 20;
      ctx.fillStyle = `rgba(20, 18, 15, ${Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }
}