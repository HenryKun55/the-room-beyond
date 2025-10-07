import { Game } from '@core/Game';
import { StorySystem } from '@systems/StorySystem';
import { InteractionSystem } from '@systems/InteractionSystem';
import { ObjectFactory } from '@core/ObjectFactory';
import * as THREE from 'three';

// Main entry point for the game
async function initGame(): Promise<void> {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) {
        throw new Error('Canvas element not found');
    }

    // Create game instance
    const game = new Game(canvas);
    
    // Initialize systems
    const storySystem = new StorySystem();
    const interactionSystem = new InteractionSystem();
    const objectFactory = new ObjectFactory();
    
    // Set interaction system reference in game
    game.setInteractionSystem(interactionSystem);
    
    // Create the main room scene
    createMainRoomScene(game, storySystem, interactionSystem, objectFactory);
    
    // Set up collision objects for camera controller
    setupCollisions(game, interactionSystem);
    
    // Set up proximity feedback
    setupProximityFeedback(interactionSystem);
    
    // Connect input to interaction system
    game.getInputHandler().onClickCallback((x: number, y: number) => {
        const camera = game.getCamera();
        const canvas = game.getRenderer().domElement;
        
        // Convert screen coordinates to normalized device coordinates
        const mouse = new THREE.Vector2();
        mouse.x = (x / canvas.clientWidth) * 2 - 1;
        mouse.y = -(y / canvas.clientHeight) * 2 + 1;
        
        // Get all registered objects for raycasting
        const registeredObjects = interactionSystem.getRegisteredObjects();
        const meshes: THREE.Object3D[] = [];
        
        registeredObjects.forEach(obj => {
            // Add the main mesh and all its children for raycasting
            meshes.push(obj.mesh);
            obj.mesh.traverse((child) => {
                if (child.type === 'Mesh') {
                    meshes.push(child);
                }
            });
        });
        
        // Perform raycasting
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(meshes, false);
        
        if (intersects.length > 0) {
            // Find which registered object was hit
            const hitMesh = intersects[0].object;
            let hitObject = null;
            
            // Check if the hit object is a registered object directly
            hitObject = interactionSystem.getObjectByMesh(hitMesh);
            
            // If not found, check if it's a child of a registered object
            if (!hitObject) {
                let parent = hitMesh.parent;
                while (parent && !hitObject) {
                    hitObject = interactionSystem.getObjectByMesh(parent);
                    parent = parent.parent;
                }
            }
            
            if (hitObject) {
                console.log('Clicked on:', hitObject.name);
                interactionSystem.handleClick(hitObject);
            }
        }
    });
    
    // Start the game
    game.start();
    
    // Debug info updates
    updateDebugInfo(game, storySystem, interactionSystem);
}

function createMainRoomScene(game: Game, storySystem: StorySystem, interactionSystem: InteractionSystem, objectFactory: ObjectFactory): void {
    const scene = game.getScene();
    
    // Add atmospheric lighting
    const ambientLight = new THREE.AmbientLight(0x2a2a3a, 0.3);
    scene.add(ambientLight);
    
    // Main room light - dim and moody
    const roomLight = new THREE.DirectionalLight(0xffffff, 0.5);
    roomLight.position.set(3, 8, 4);
    roomLight.castShadow = true;
    roomLight.shadow.mapSize.width = 2048;
    roomLight.shadow.mapSize.height = 2048;
    scene.add(roomLight);
    
    // Warm accent light from the corner
    const accentLight = new THREE.PointLight(0xffaa77, 0.4, 10);
    accentLight.position.set(-3, 2, -3);
    scene.add(accentLight);
    
    // Create room structure
    createRoomStructure(scene);
    
    // Create and place furniture
    const desk = objectFactory.createDesk('desk', 2, 0, -3);
    scene.add(desk.mesh);
    interactionSystem.registerObject(desk);
    
    const bed = objectFactory.createBed('bed', -3, 0, 2);
    scene.add(bed.mesh);
    interactionSystem.registerObject(bed);
    
    const chair = objectFactory.createChair('chair', 1.5, 0, -2.5);
    scene.add(chair.mesh);
    interactionSystem.registerObject(chair);
    
    // Create and place interactive technology objects
    const laptop = objectFactory.createLaptop('laptop', 2, 0.8, -3);
    scene.add(laptop.mesh);
    interactionSystem.registerObject(laptop);
    
    const phone = objectFactory.createPhone('phone', 1.5, 0.8, -3.2);
    scene.add(phone.mesh);
    interactionSystem.registerObject(phone);
    
    const vrHeadset = objectFactory.createVRHeadset('vr_headset', -2, 0.6, 2);
    scene.add(vrHeadset.mesh);
    interactionSystem.registerObject(vrHeadset);
    
    const alarmClock = objectFactory.createAlarmClock('alarm_clock', -2.5, 0.6, 1.5);
    scene.add(alarmClock.mesh);
    interactionSystem.registerObject(alarmClock);
    
    // Connect objects to story system
    setupStoryIntegration(storySystem, interactionSystem);
}

function createRoomStructure(scene: THREE.Scene): void {
    // Room walls - using BackSide to render interior
    const roomGeometry = new THREE.BoxGeometry(8, 4, 8);
    const roomMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a3a3a,
        side: THREE.BackSide
    });
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    room.position.set(0, 2, 0);
    room.receiveShadow = true;
    scene.add(room);
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(8, 8);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        roughness: 0.8,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(8, 8);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x404040,
        roughness: 0.9
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 4;
    scene.add(ceiling);
}

function setupCollisions(game: Game, interactionSystem: InteractionSystem): void {
    const cameraController = game.getCameraController();
    const registeredObjects = interactionSystem.getRegisteredObjects();
    
    // Add all interactive objects as collision objects
    registeredObjects.forEach(obj => {
        cameraController.addCollisionObject(obj.mesh);
    });
    
    console.log(`Collision detection enabled for ${registeredObjects.length} objects`);
}

function setupProximityFeedback(interactionSystem: InteractionSystem): void {
    // Set up proximity event handlers
    interactionSystem.onProximityEnter((object) => {
        console.log(`Near interactive object: ${object.name}`);
    });
    
    interactionSystem.onProximityExit((object) => {
        console.log(`Left interactive object: ${object.name}`);
    });
    
    console.log('Proximity detection system initialized');
}

function setupStoryIntegration(storySystem: StorySystem, interactionSystem: InteractionSystem): void {
    // Listen for object interactions and update story flags
    interactionSystem.onClick((object) => {
        console.log(`Interacted with: ${object.name}`);
        storySystem.setFlag(`${object.id}_interacted`, true);
        storySystem.discoverObject(object.id);
        
        // Check for story progression
        if (object.id === 'laptop') {
            storySystem.setFlag('laptop_accessed', true);
        } else if (object.id === 'vr_headset') {
            storySystem.setFlag('vr_examined', true);
        } else if (object.id === 'phone') {
            storySystem.setFlag('phone_examined', true);
        }
    });
    
    // Listen for story events
    storySystem.on('actChanged', (data) => {
        console.log(`Act changed: ${data.previousAct} -> ${data.currentAct}`);
    });
    
    storySystem.on('objectDiscovered', (data) => {
        console.log(`Object discovered: ${data.objectId} (${data.totalDiscovered} total)`);
    });
}

function updateDebugInfo(game: Game, storySystem: StorySystem, interactionSystem: InteractionSystem): void {
    let lastTime = 0;
    let frameCount = 0;
    let fps = 0;
    
    function update(): void {
        const currentTime = performance.now();
        frameCount++;
        
        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
        }
        
        // Update debug displays
        const fpsElement = document.getElementById('fps');
        const positionElement = document.getElementById('position');
        const objectsElement = document.getElementById('objects');
        
        if (fpsElement) fpsElement.textContent = `FPS: ${fps}`;
        
        const camera = game.getCamera();
        if (positionElement && camera.position) {
            const cameraController = game.getCameraController();
            const pos = cameraController.getPosition();
            positionElement.textContent = `Position: ${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;
        }
        
        if (objectsElement) {
            const discovered = storySystem.getDiscoveredObjects().size;
            const currentAct = storySystem.getCurrentAct();
            const nearbyCount = interactionSystem.getNearbyObjects().length;
            objectsElement.textContent = `Act ${currentAct} | Objects: ${discovered}/7 | Nearby: ${nearbyCount}`;
        }
        
        requestAnimationFrame(update);
    }
    
    update();
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame().catch(console.error);
});