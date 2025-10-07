import * as THREE from 'three';
import { InteractableObject } from '../types/interfaces';

export class ObjectFactory {
  
  // Main interactive objects for the game story
  createPhone(id: string, x: number, y: number, z: number): InteractableObject {
    const phoneGroup = new THREE.Group();
    
    // Phone body
    const bodyGeometry = new THREE.BoxGeometry(0.08, 0.15, 0.008);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    phoneGroup.add(body);
    
    // Screen
    const screenGeometry = new THREE.BoxGeometry(0.075, 0.13, 0.001);
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.005;
    phoneGroup.add(screen);
    
    phoneGroup.position.set(x, y, z);
    phoneGroup.userData.interactableId = id;
    phoneGroup.castShadow = true;
    
    return {
      id,
      mesh: phoneGroup,
      name: 'Phone',
      description: 'A sleek smartphone. The screen is black and unresponsive.',
      examined: false,
      onExamine: () => {
        console.log('Examining phone: It\'s turned off and won\'t respond.');
      },
      highlightOnHover: true
    };
  }

  createLaptop(id: string, x: number, y: number, z: number): InteractableObject {
    const laptopGroup = new THREE.Group();
    
    // Laptop base
    const baseGeometry = new THREE.BoxGeometry(0.35, 0.02, 0.25);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    laptopGroup.add(base);
    
    // Laptop screen
    const screenGeometry = new THREE.BoxGeometry(0.32, 0.18, 0.01);
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a0a });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0.1, -0.1);
    screen.rotation.x = -Math.PI * 0.15;
    screen.castShadow = true;
    laptopGroup.add(screen);
    
    laptopGroup.position.set(x, y, z);
    laptopGroup.userData.interactableId = id;
    
    return {
      id,
      mesh: laptopGroup,
      name: 'Laptop',
      description: 'A modern laptop computer with a black screen.',
      examined: false,
      onExamine: () => {
        console.log('Examining laptop: The screen is black. It appears to be in sleep mode.');
      },
      highlightOnHover: true
    };
  }

  createVRHeadset(id: string, x: number, y: number, z: number): InteractableObject {
    const vrGroup = new THREE.Group();
    
    // Main headset body
    const headsetGeometry = new THREE.BoxGeometry(0.2, 0.12, 0.15);
    const headsetMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const headset = new THREE.Mesh(headsetGeometry, headsetMaterial);
    headset.castShadow = true;
    vrGroup.add(headset);
    
    // Head strap
    const strapGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.02);
    const strapMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const strap = new THREE.Mesh(strapGeometry, strapMaterial);
    strap.position.set(0, 0, -0.1);
    strap.rotation.x = Math.PI / 2;
    vrGroup.add(strap);
    
    vrGroup.position.set(x, y, z);
    vrGroup.userData.interactableId = id;
    
    return {
      id,
      mesh: vrGroup,
      name: 'VR Headset',
      description: 'A high-end virtual reality headset. It looks expensive and well-used.',
      examined: false,
      onExamine: () => {
        console.log('Examining VR headset: Heavy and sophisticated. The lenses are clean but the device is off.');
      },
      highlightOnHover: true
    };
  }

  createAlarmClock(id: string, x: number, y: number, z: number): InteractableObject {
    const clockGroup = new THREE.Group();
    
    // Clock body
    const bodyGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.06);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    clockGroup.add(body);
    
    // Digital display
    const displayGeometry = new THREE.BoxGeometry(0.08, 0.03, 0.001);
    const displayMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x330000,
      emissive: 0x220000,
      emissiveIntensity: 0.3
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.set(0, 0.01, 0.031);
    clockGroup.add(display);
    
    clockGroup.position.set(x, y, z);
    clockGroup.userData.interactableId = id;
    
    return {
      id,
      mesh: clockGroup,
      name: 'Alarm Clock',
      description: 'A digital alarm clock with glowing red numbers.',
      examined: false,
      onExamine: () => {
        console.log('Examining alarm clock: Shows 3:47 AM. The red numbers glow ominously in the dark.');
      },
      highlightOnHover: true
    };
  }

  // Furniture objects
  createDesk(id: string, x: number, y: number, z: number): InteractableObject {
    const deskGroup = new THREE.Group();
    
    // Desktop
    const topGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.6);
    const topMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.75;
    top.castShadow = true;
    top.receiveShadow = true;
    deskGroup.add(top);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.05, 0.75, 0.05);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    
    const positions = [
      [-0.55, 0.375, -0.25],
      [0.55, 0.375, -0.25],
      [-0.55, 0.375, 0.25],
      [0.55, 0.375, 0.25]
    ];
    
    positions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      deskGroup.add(leg);
    });
    
    deskGroup.position.set(x, y, z);
    deskGroup.userData.interactableId = id;
    
    return {
      id,
      mesh: deskGroup,
      name: 'Desk',
      description: 'A sturdy wooden desk. Papers are scattered across its surface.',
      examined: false,
      onExamine: () => {
        console.log('Examining desk: Old work papers and coffee stains. Nothing important here.');
      },
      highlightOnHover: true
    };
  }

  createBed(id: string, x: number, y: number, z: number): InteractableObject {
    const bedGroup = new THREE.Group();
    
    // Mattress
    const mattressGeometry = new THREE.BoxGeometry(1.0, 0.2, 2.0);
    const mattressMaterial = new THREE.MeshStandardMaterial({ color: 0xF5F5DC });
    const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
    mattress.position.y = 0.4;
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    bedGroup.add(mattress);
    
    // Bed frame
    const frameGeometry = new THREE.BoxGeometry(1.1, 0.3, 2.1);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.y = 0.15;
    frame.castShadow = true;
    bedGroup.add(frame);
    
    // Pillow
    const pillowGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.4);
    const pillowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow.position.set(-0.2, 0.55, -0.6);
    pillow.castShadow = true;
    bedGroup.add(pillow);
    
    bedGroup.position.set(x, y, z);
    bedGroup.userData.interactableId = id;
    
    return {
      id,
      mesh: bedGroup,
      name: 'Bed',
      description: 'An unmade bed with wrinkled sheets and a single pillow.',
      examined: false,
      onExamine: () => {
        console.log('Examining bed: The sheets are cold and haven\'t been slept in tonight.');
      },
      highlightOnHover: true
    };
  }

  createChair(id: string, x: number, y: number, z: number): InteractableObject {
    const chairGroup = new THREE.Group();
    
    // Seat
    const seatGeometry = new THREE.BoxGeometry(0.45, 0.05, 0.45);
    const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.y = 0.45;
    seat.castShadow = true;
    seat.receiveShadow = true;
    chairGroup.add(seat);
    
    // Backrest
    const backGeometry = new THREE.BoxGeometry(0.45, 0.4, 0.05);
    const backMaterial = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.set(0, 0.65, -0.2);
    back.castShadow = true;
    chairGroup.add(back);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.45);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x1C1C1C });
    
    const legPositions = [
      [-0.18, 0.225, -0.18],
      [0.18, 0.225, -0.18],
      [-0.18, 0.225, 0.18],
      [0.18, 0.225, 0.18]
    ];
    
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      chairGroup.add(leg);
    });
    
    chairGroup.position.set(x, y, z);
    chairGroup.userData.interactableId = id;
    
    return {
      id,
      mesh: chairGroup,
      name: 'Chair',
      description: 'A simple office chair. The seat shows signs of heavy use.',
      examined: false,
      onExamine: () => {
        console.log('Examining chair: Worn but functional. Countless hours were spent here.');
      },
      highlightOnHover: true
    };
  }
}