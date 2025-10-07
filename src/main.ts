import { Game } from '@core/Game';
import { StorySystem } from '@systems/StorySystem';
import { InteractionSystem } from '@systems/InteractionSystem';
import { SimpleDialogueContent } from '@/content/SimpleDialogueContent';
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
    
    // Connect E key to interaction system
    setupInteractionControls(game, interactionSystem);
    
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
    
    // Connect objects to story system and simple dialogue
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

function setupInteractionControls(game: Game, interactionSystem: InteractionSystem): void {
    const inputHandler = game.getInputHandler();
    
    // Handle E key press for interaction
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'e') {
            const success = interactionSystem.triggerInteraction();
            if (success) {
                console.log('Interaction triggered with E key');
            }
        }
    });
    
    console.log('E-key interaction controls initialized');
}

function setupProximityFeedback(interactionSystem: InteractionSystem): void {
    const interactionHint = document.getElementById('interaction-hint');
    
    // Set up focus change event handlers
    interactionSystem.onFocusChange((object, previous) => {
        if (object) {
            console.log(`Focused on: ${object.name}`);
            if (interactionHint) {
                interactionHint.textContent = `Press E to examine: ${object.name}`;
                interactionHint.style.display = 'block';
            }
        } else {
            console.log('No object in focus');
            if (interactionHint) {
                interactionHint.style.display = 'none';
            }
        }
    });
    
    // Set up proximity event handlers for debug
    interactionSystem.onProximityEnter((object) => {
        console.log(`Near interactive object: ${object.name}`);
    });
    
    interactionSystem.onProximityExit((object) => {
        console.log(`Left interactive object: ${object.name}`);
    });
    
    console.log('Focus-based interaction system initialized');
}

function setupStoryIntegration(storySystem: StorySystem, interactionSystem: InteractionSystem): void {
    // Listen for object interactions and show simple descriptions
    interactionSystem.onInteraction((object) => {
        console.log(`Interacted with: ${object.name}`);
        
        // Get simple description from SimpleDialogueContent
        const description = SimpleDialogueContent.getObjectDescription(object.id);
        
        if (description) {
            // Display the simple description
            showSimpleDescription(object.name, description);
            
            // Update story flags
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
        } else {
            // Fallback to generic message if no description exists
            showSimpleDescription(object.name, `You examine the ${object.name.toLowerCase()}.`);
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

function showSimpleDescription(objectName: string, description: string): void {
    // Find or create dialogue container
    let dialogueContainer = document.getElementById('dialogue-container');
    if (!dialogueContainer) {
        dialogueContainer = document.createElement('div');
        dialogueContainer.id = 'dialogue-container';
        dialogueContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            max-width: 600px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff88;
            padding: 20px;
            border: 2px solid #00ff88;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.4;
            z-index: 1000;
            display: none;
        `;
        document.body.appendChild(dialogueContainer);
    }
    
    // Set the description text
    dialogueContainer.innerHTML = `
        <div style="margin-bottom: 10px; color: #fff; font-weight: bold;">${objectName}</div>
        <div>${description}</div>
        <div style="margin-top: 15px; color: #888; font-size: 12px;">Press SPACE to close</div>
    `;
    
    // Show the dialogue
    dialogueContainer.style.display = 'block';
    
    // Add SPACE key handler to close dialogue
    const handleSpace = (event: KeyboardEvent) => {
        if (event.key === ' ' || event.code === 'Space') {
            dialogueContainer!.style.display = 'none';
            document.removeEventListener('keydown', handleSpace);
        }
    };
    document.addEventListener('keydown', handleSpace);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (dialogueContainer && dialogueContainer.style.display !== 'none') {
            dialogueContainer.style.display = 'none';
            document.removeEventListener('keydown', handleSpace);
        }
    }, 10000);
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
            const focusedName = interactionSystem.getFocusedObjectName();
            const focusText = focusedName ? ` | Focus: ${focusedName}` : '';
            objectsElement.textContent = `Act ${currentAct} | Objects: ${discovered}/7 | Nearby: ${nearbyCount}${focusText}`;
        }
        
        requestAnimationFrame(update);
    }
    
    update();
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame().catch(console.error);
});