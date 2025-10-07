import { Game } from '@core/Game';
import { StorySystem } from '@systems/StorySystem';
import { InteractionSystem } from '@systems/InteractionSystem';
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
    
    // Add a simple test scene with basic objects
    createTestScene(game, storySystem, interactionSystem);
    
    // Connect input to interaction system
    game.getInputHandler().onClickCallback((x: number, y: number) => {
        const camera = game.getCamera();
        const scene = game.getScene();
        
        // Get all interactable objects from the scene
        const interactables: THREE.Object3D[] = [];
        scene.traverse((child: THREE.Object3D) => {
            if (child.userData.interactableId) {
                interactables.push(child);
            }
        });
        
        // Check for interaction
        const hitObject = interactionSystem.checkInteraction(camera, x, y, interactables);
        if (hitObject) {
            console.log('Clicked on:', hitObject.name);
            interactionSystem.handleClick(hitObject);
        }
    });
    
    // Start the game
    game.start();
    
    // Debug info updates
    updateDebugInfo(game, storySystem, interactionSystem);
}

function createTestScene(game: Game, storySystem: StorySystem, interactionSystem: InteractionSystem): void {
    const scene = game.getScene();
    
    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create a simple room
    const roomGeometry = new THREE.BoxGeometry(10, 4, 10);
    const roomMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        side: THREE.BackSide
    });
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    room.position.set(0, 2, 0);
    scene.add(room);
    
    // Add a floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create test objects
    createTestCube(scene, interactionSystem, storySystem, { x: 2, y: 1, z: 0 }, 'red_cube');
    createTestCube(scene, interactionSystem, storySystem, { x: -2, y: 1, z: 0 }, 'blue_cube');
    createTestCube(scene, interactionSystem, storySystem, { x: 0, y: 1, z: -2 }, 'green_cube');
}

function createTestCube(
    scene: THREE.Scene, 
    interactionSystem: InteractionSystem, 
    storySystem: StorySystem,
    position: { x: number, y: number, z: number },
    id: string
): void {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const colors = {
        red_cube: 0xff0000,
        blue_cube: 0x0000ff,
        green_cube: 0x00ff00
    };
    
    const material = new THREE.MeshStandardMaterial({ 
        color: colors[id as keyof typeof colors] || 0xffffff 
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.userData.interactableId = id;
    mesh.castShadow = true;
    scene.add(mesh);
    
    // Create interactable object
    const interactableObject = {
        id,
        mesh,
        name: id.replace('_', ' ').toUpperCase(),
        description: `A ${id.replace('_cube', '')} cube for testing interactions`,
        examined: false,
        onExamine: () => {
            console.log(`Examined ${id}`);
            storySystem.setFlag(`${id}_examined`, true);
            storySystem.discoverObject(id);
        },
        highlightOnHover: true
    };
    
    interactionSystem.registerObject(interactableObject);
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
            objectsElement.textContent = `Objects: ${discovered}/3`;
        }
        
        requestAnimationFrame(update);
    }
    
    update();
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame().catch(console.error);
});