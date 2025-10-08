import { Game } from '@core/Game';
import { StorySystem } from '@systems/StorySystem';
import { InteractionSystem } from '@systems/InteractionSystem';
import { SimpleDialogueContent } from '@/content/SimpleDialogueContent';
import { DialogueModal } from '@/systems/DialogueModal';
import { AudioSystem } from '@/systems/AudioSystem';
import { ObjectFactory } from '@core/ObjectFactory';
import { RoomFactory } from '@core/RoomFactory';
import { LightingSystem } from '@systems/LightingSystem';

// Main entry point for the game
async function initGame(): Promise<void> {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) {
        throw new Error('Canvas element not found');
    }

    // Create game instance
    const game = new Game(canvas);
    
    // Initialize all systems
    const storySystem = new StorySystem();
    const interactionSystem = new InteractionSystem();
    const dialogueModal = new DialogueModal(game);
    const audioSystem = new AudioSystem();
    const objectFactory = new ObjectFactory();
    const roomFactory = new RoomFactory();
    const lightingSystem = new LightingSystem();
    
    // Set interaction system reference in game
    game.setInteractionSystem(interactionSystem);
    
    // Initialize systems
    await initializeAudioSystem(audioSystem);
    createMainRoomScene(game, roomFactory, lightingSystem, objectFactory, interactionSystem);
    setupSystemIntegrations(game, storySystem, interactionSystem, dialogueModal, audioSystem);
    
    // Start the game
    game.start();
    
    // Start debug info updates
    updateDebugInfo(game, storySystem, interactionSystem);
}

function createMainRoomScene(
    game: Game, 
    roomFactory: RoomFactory, 
    lightingSystem: LightingSystem, 
    objectFactory: ObjectFactory, 
    interactionSystem: InteractionSystem
): void {
    const scene = game.getScene();
    
    // Add room structure using RoomFactory
    roomFactory.addToScene(scene);
    
    // Add lighting using LightingSystem
    lightingSystem.addToScene(scene);
    
    // Create and add interactive objects
    const objects = [
        { factory: () => objectFactory.createDesk('desk', 1.8, 0.01, -3.7), rotation: 0 },
        { factory: () => objectFactory.createChair('chair', 1.3, 0.01, -2.8), rotation: Math.PI },
        { factory: () => objectFactory.createBed('bed', -3.2, 0.01, 3.0), rotation: 0 },
        { factory: () => objectFactory.createLaptop('laptop', 1.8, 0.82, -3.7), rotation: 0 },
        { factory: () => objectFactory.createPhone('phone', 1.2, 0.82, -3.6), rotation: 0 },
        { factory: () => objectFactory.createVRHeadset('vr_headset', -2.8, 0.62, 2.8), rotation: 0 },
        { factory: () => objectFactory.createAlarmClock('alarm_clock', -3.5, 0.62, 2.2), rotation: 0 }
    ];
    
    objects.forEach(({ factory, rotation }) => {
        const obj = factory();
        obj.mesh.userData.id = obj.id;
        if (rotation !== 0) {
            obj.mesh.rotation.y = rotation;
        }
        scene.add(obj.mesh);
        interactionSystem.registerObject(obj);
    });
}

function setupSystemIntegrations(
    game: Game,
    storySystem: StorySystem, 
    interactionSystem: InteractionSystem, 
    dialogueModal: DialogueModal, 
    audioSystem: AudioSystem
): void {
    // Set up collision detection
    setupCollisions(game, interactionSystem);
    
    // Set up proximity feedback
    setupProximityFeedback(interactionSystem);
    
    // Connect E key to interaction system
    setupInteractionControls(game, interactionSystem);
    
    // Connect objects to story system and dialogue modal
    setupStoryIntegration(storySystem, interactionSystem, dialogueModal);
    
    // Set up audio integration
    setupAudioIntegration(interactionSystem, audioSystem);
}

function setupCollisions(game: Game, interactionSystem: InteractionSystem): void {
    const cameraController = game.getCameraController();
    const registeredObjects = interactionSystem.getRegisteredObjects();
    
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
            // Don't trigger interactions if game is paused (dialogue active)
            if (!game.isPaused()) {
                const success = interactionSystem.triggerInteraction();
                if (success) {
                    console.log('Interaction triggered with E key');
                }
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

function setupStoryIntegration(storySystem: StorySystem, interactionSystem: InteractionSystem, dialogueModal: DialogueModal): void {
    // Listen for object interactions and show simple descriptions
    interactionSystem.onInteraction((object) => {
        console.log(`Interacted with: ${object.name}`);
        
        // Get simple description from SimpleDialogueContent
        const description = SimpleDialogueContent.getObjectDescription(object.id);
        
        if (description) {
            // Display the simple description using DialogueModal
            dialogueModal.show(object.name, description);
            
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
            dialogueModal.show(object.name, `You examine the ${object.name.toLowerCase()}.`);
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

// Inline modal code removed - now using isolated DialogueModal class

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

async function initializeAudioSystem(audioSystem: AudioSystem): Promise<void> {
    try {
        // Preload sound effects
        const soundAssets = {
            'interact': '/sounds/interact.mp3',
            'click': '/sounds/click.mp3',
            'hover': '/sounds/hover.mp3',
            'ambient': '/sounds/ambient-room.mp3'
        };
        
        console.log('Loading audio assets...');
        await audioSystem.preloadSounds(soundAssets);
        console.log('Audio system initialized successfully');
        
        // Start ambient music
        audioSystem.playMusic('/sounds/ambient-room.mp3', true);
        audioSystem.setMusicVolume(0.3); // Lower volume for ambient
        
    } catch (error) {
        console.warn('Audio system initialization failed, continuing without sound:', error);
    }
}

function setupAudioIntegration(interactionSystem: InteractionSystem, audioSystem: AudioSystem): void {
    // Handle user interaction for audio context
    document.addEventListener('click', async () => {
        await audioSystem.resumeAudioContext();
    }, { once: true });
    
    // Play sound effects on interactions
    interactionSystem.onInteraction((object) => {
        console.log(`Playing interaction sound for: ${object.name}`);
        audioSystem.playSFX('interact', 0.7);
    });
    
    // Play hover sounds on focus change
    interactionSystem.onFocusChange((object, previous) => {
        if (object) {
            audioSystem.playSFX('hover', 0.4);
        }
    });
    
    console.log('Audio integration initialized');
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame().catch(console.error);
});