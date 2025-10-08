import * as THREE from 'three';

export interface RoomLighting {
  ambientLight: THREE.AmbientLight;
  ceilingLight: THREE.PointLight;
  deskLight: THREE.PointLight;
  lampShade: THREE.Mesh;
  deskLampBase: THREE.Mesh;
  deskLampArm: THREE.Mesh;
}

export interface LightingConfig {
  ambientIntensity?: number;
  ceilingIntensity?: number;
  deskIntensity?: number;
}

export class LightingSystem {
  private currentLighting: RoomLighting | null = null;

  createRoomLighting(): RoomLighting {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x4a4a5a, 0.4);
    
    // Ceiling lamp fixture (visible)
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x8a8a7a })
    );
    lampShade.position.set(0, 3.6, 0);
    lampShade.rotation.x = Math.PI;
    
    // Main ceiling light from the lamp
    const ceilingLight = new THREE.PointLight(0xffffcc, 1.2, 12);
    ceilingLight.position.set(0, 3.4, 0);
    ceilingLight.castShadow = true;
    ceilingLight.shadow.mapSize.width = 2048;
    ceilingLight.shadow.mapSize.height = 2048;
    
    // Desk lamp base (visible fixture)
    const deskLampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    deskLampBase.position.set(2.2, 0.82, -3.7);
    
    // Desk lamp arm
    const deskLampArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    deskLampArm.position.set(2.2, 1.0, -3.7);
    deskLampArm.rotation.z = -0.3;
    
    // Desk light
    const deskLight = new THREE.PointLight(0xffffaa, 0.8, 4);
    deskLight.position.set(2.2, 1.2, -3.7);
    
    const lighting: RoomLighting = {
      ambientLight,
      ceilingLight,
      deskLight,
      lampShade,
      deskLampBase,
      deskLampArm
    };
    
    this.currentLighting = lighting;
    return lighting;
  }

  addToScene(scene: THREE.Scene): void {
    const lighting = this.createRoomLighting();
    
    // Add lights
    scene.add(lighting.ambientLight);
    scene.add(lighting.ceilingLight);
    scene.add(lighting.deskLight);
    
    // Add visible fixtures
    scene.add(lighting.lampShade);
    scene.add(lighting.deskLampBase);
    scene.add(lighting.deskLampArm);
  }

  updateLighting(config: LightingConfig): void {
    if (!this.currentLighting) return;
    
    if (config.ambientIntensity !== undefined) {
      this.currentLighting.ambientLight.intensity = config.ambientIntensity;
    }
    
    if (config.ceilingIntensity !== undefined) {
      this.currentLighting.ceilingLight.intensity = config.ceilingIntensity;
    }
    
    if (config.deskIntensity !== undefined) {
      this.currentLighting.deskLight.intensity = config.deskIntensity;
    }
  }

  dispose(): void {
    this.currentLighting = null;
  }
}