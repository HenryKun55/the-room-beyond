# Technical Specifications - The Room Beyond

## Technology Stack

### Core Technologies
- **HTML5**: Canvas and DOM structure
- **TypeScript 5.x**: Strongly-typed game logic
- **Three.js r128**: 3D rendering engine
- **CSS3**: UI and overlay styling

### Testing Framework
- **Jest**: Unit and integration testing
- **@testing-library**: DOM testing utilities
- **ts-jest**: TypeScript support for Jest

### Build Tools
- **Vite**: Fast build tool and dev server
- **TypeScript Compiler**: Type checking
- **ESLint**: Code quality
- **Prettier**: Code formatting

## Architecture (Updated October 2025)

### ✅ **Current Architecture - Modular System Design**

Our architecture follows **Single Responsibility Principle** with isolated, testable systems:

```
src/
├── core/                       # Core engine components
│   ├── Game.ts                 # Main game loop & rendering
│   ├── InputHandler.ts         # Input management
│   ├── CameraController.ts     # FPS camera + collision detection
│   ├── ObjectFactory.ts        # Procedural 3D object creation
│   └── RoomFactory.ts          # Room structure generation
├── systems/                    # Game logic systems  
│   ├── StorySystem.ts          # Narrative & progression
│   ├── InteractionSystem.ts    # Object interaction
│   ├── DialogueModal.ts        # UI dialogue display
│   ├── AudioSystem.ts          # Sound management
│   └── LightingSystem.ts       # Scene lighting
├── content/                    # Game content
│   └── SimpleDialogueContent.ts # Object descriptions
└── main.ts                     # System orchestration (150 lines)
```

### Design Patterns

#### 1. **Factory Pattern** (Object Creation)
```typescript
export class ObjectFactory {
  createDesk(id: string, x: number, y: number, z: number): InteractiveObject {
    const geometry = new THREE.BoxGeometry(1.5, 0.8, 0.8);
    const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const mesh = new THREE.Mesh(geometry, material);
    
    return {
      id, name: 'Desk', mesh,
      interactionRadius: 2.0,
      onInteract: () => console.log('Examining desk...')
    };
  }
}
```

#### 2. **Observer Pattern** (Event System)
```typescript
export class StorySystem {
  private eventListeners: Map<StoryEventType, EventCallback[]> = new Map();
  
  on(event: StoryEventType, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(callback);
    this.eventListeners.set(event, listeners);
  }
  
  private emit(event: StoryEventType, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }
}
```

#### 3. **Strategy Pattern** (Collision Detection)
```typescript
export class CameraController {
  private checkObjectCollision(position: THREE.Vector3, object: THREE.Object3D): boolean {
    const box = new THREE.Box3().setFromObject(object);
    const expandedBox = box.clone().expandByScalar(this.playerRadius);
    return expandedBox.containsPoint(position);
  }
}
```

#### 4. **Dependency Injection** (System Integration)
```typescript
async function initGame(): Promise<void> {
  // Create isolated systems
  const game = new Game(canvas);
  const roomFactory = new RoomFactory();
  const lightingSystem = new LightingSystem();
  const interactionSystem = new InteractionSystem();
  
  // Inject dependencies
  game.setInteractionSystem(interactionSystem);
  
  // Compose systems
  createMainRoomScene(game, roomFactory, lightingSystem, objectFactory, interactionSystem);
}
```

### Game States (Simplified)
```typescript
export class Game {
  private paused: boolean = false;
  
  pause(): void {
    this.paused = true;
    this.cameraController.setEnabled(false);
  }
  
  unpause(): void {
    this.paused = false;
    this.cameraController.setEnabled(true);
  }
}
  LOADING,
  MAIN_MENU,
  PLAYING,
  PAUSED,
  DIALOGUE,
  GAME_OVER
}
```

#### 4. Command Pattern (Input)
```typescript
interface Command {
  execute(): void;
  undo?(): void;
}
```

## Core Systems

### 1. Game Loop
```typescript
class Game {
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimeStep: number = 1000 / 60; // 60 FPS

  private gameLoop(currentTime: number): void {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // Fixed time step for physics/logic
    while (this.accumulator >= this.fixedTimeStep) {
      this.update(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }

    // Variable time step for rendering
    this.render(deltaTime);
    
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number): void {
    this.inputHandler.update();
    this.sceneManager.update(deltaTime);
    this.storySystem.update(deltaTime);
    this.dialogueSystem.update(deltaTime);
  }

  private render(deltaTime: number): void {
    this.renderer.render(this.scene, this.camera);
  }
}
```

### 2. Scene Management
```typescript
interface Scene {
  setup(): void;
  enter(): void;
  exit(): void;
  update(deltaTime: number): void;
  dispose(): void;
}

class SceneManager {
  private scenes: Map<string, Scene> = new Map();
  private currentScene: Scene | null = null;
  
  async switchScene(sceneName: string): Promise<void> {
    if (this.currentScene) {
      this.currentScene.exit();
    }
    
    const nextScene = this.scenes.get(sceneName);
    if (nextScene) {
      await nextScene.setup();
      nextScene.enter();
      this.currentScene = nextScene;
    }
  }
}
```

### 3. Interaction System (Raycasting)
```typescript
class InteractionSystem {
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  
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
      return this.getInteractableFromMesh(intersects[0].object);
    }
    
    return null;
  }
}
```

### 4. Dialogue System
```typescript
interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices?: DialogueChoice[];
  next?: string;
  onComplete?: () => void;
}

interface DialogueChoice {
  text: string;
  next: string;
  condition?: () => boolean;
}

class DialogueSystem {
  private currentNode: DialogueNode | null = null;
  private dialogueTree: Map<string, DialogueNode> = new Map();
  
  startDialogue(nodeId: string): void {
    const node = this.dialogueTree.get(nodeId);
    if (node) {
      this.currentNode = node;
      this.displayNode(node);
    }
  }
  
  selectChoice(choiceIndex: number): void {
    if (!this.currentNode?.choices) return;
    
    const choice = this.currentNode.choices[choiceIndex];
    if (choice.condition && !choice.condition()) return;
    
    this.startDialogue(choice.next);
  }
}
```

### 5. Story Progression System
```typescript
interface StoryFlag {
  key: string;
  value: boolean | number | string;
}

class StorySystem {
  private flags: Map<string, any> = new Map();
  private discoveredObjects: Set<string> = new Set();
  
  setFlag(key: string, value: any): void {
    this.flags.set(key, value);
    this.checkProgressionTriggers();
  }
  
  getFlag(key: string): any {
    return this.flags.get(key);
  }
  
  discoverObject(objectId: string): void {
    this.discoveredObjects.add(objectId);
    this.checkStoryProgression();
  }
  
  private checkStoryProgression(): void {
    // Act transitions based on discoveries
    if (this.discoveredObjects.size >= 3 && !this.getFlag('act1_complete')) {
      this.setFlag('act1_complete', true);
      // Trigger Act 2 events
    }
  }
}
```

## 3D Environment

### Room Layout (Procedurally Generated)
```typescript
class RoomBuilder {
  buildRoom(scene: THREE.Scene): void {
    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x8B7355,
        roughness: 0.8,
        metalness: 0.2
      })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    
    // Walls
    this.buildWalls(scene);
    
    // Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xE8E8E8,
        roughness: 0.9
      })
    );
    ceiling.position.y = 3;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);
    
    // Window
    this.buildWindow(scene);
    
    // Door
    this.buildDoor(scene);
  }
  
  private buildWalls(scene: THREE.Scene): void {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4C5B9,
      roughness: 0.7
    });
    
    // 4 walls
    const walls = [
      { pos: [0, 1.5, -5], rot: [0, 0, 0] },      // Back
      { pos: [0, 1.5, 5], rot: [0, Math.PI, 0] }, // Front (door)
      { pos: [-5, 1.5, 0], rot: [0, Math.PI/2, 0] }, // Left
      { pos: [5, 1.5, 0], rot: [0, -Math.PI/2, 0] }  // Right (window)
    ];
    
    walls.forEach(wall => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 3),
        wallMaterial
      );
      mesh.position.set(...wall.pos);
      mesh.rotation.set(...wall.rot);
      scene.add(mesh);
    });
  }
}
```

### Interactive Objects
```typescript
interface InteractableObject {
  id: string;
  mesh: THREE.Object3D;
  name: string;
  description: string;
  examined: boolean;
  onExamine: () => void;
  highlightOnHover: boolean;
}

class ObjectFactory {
  createAlarmClock(position: THREE.Vector3): InteractableObject {
    const group = new THREE.Group();
    
    // Clock body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.15, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x2C3E50 })
    );
    group.add(body);
    
    // Digital display
    const display = new THREE.Mesh(
      new THREE.PlaneGeometry(0.25, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x00FF00 })
    );
    display.position.set(0, 0.001, 0.101);
    group.add(display);
    
    group.position.copy(position);
    
    return {
      id: 'alarm_clock',
      mesh: group,
      name: 'Alarm Clock',
      description: '6:47 AM, Wednesday, October 18th',
      examined: false,
      onExamine: () => {
        // Trigger dialogue
      },
      highlightOnHover: true
    };
  }
  
  createPhone(position: THREE.Vector3): InteractableObject {
    const phone = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.15, 0.01),
      new THREE.MeshStandardMaterial({ 
        color: 0x1C1C1E,
        metalness: 0.6,
        roughness: 0.4
      })
    );
    
    // Screen
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.07, 0.13),
      new THREE.MeshBasicMaterial({ 
        color: 0x0A84FF,
        emissive: 0x0A84FF,
        emissiveIntensity: 0.3
      })
    );
    screen.position.z = 0.006;
    phone.add(screen);
    
    phone.position.copy(position);
    
    return {
      id: 'phone',
      mesh: phone,
      name: 'Smartphone',
      description: '6 missed calls. 3 voicemails.',
      examined: false,
      onExamine: () => {
        // Open phone UI
      },
      highlightOnHover: true
    };
  }
}
```

### Lighting System
```typescript
class LightingManager {
  private ambientLight: THREE.AmbientLight;
  private sunlight: THREE.DirectionalLight;
  private lampLight: THREE.PointLight;
  
  constructor(scene: THREE.Scene) {
    // Base ambient light
    this.ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(this.ambientLight);
    
    // Sunlight through window
    this.sunlight = new THREE.DirectionalLight(0xFFE4B5, 0.6);
    this.sunlight.position.set(5, 3, -2);
    scene.add(this.sunlight);
    
    // Desk lamp
    this.lampLight = new THREE.PointLight(0xFFAA33, 0.8, 3);
    this.lampLight.position.set(-2, 1.5, -1);
    scene.add(this.lampLight);
  }
  
  setMood(mood: 'calm' | 'tense' | 'revelation'): void {
    switch(mood) {
      case 'calm':
        this.ambientLight.intensity = 0.4;
        this.sunlight.intensity = 0.6;
        break;
      case 'tense':
        this.ambientLight.intensity = 0.2;
        this.sunlight.intensity = 0.3;
        this.lampLight.intensity = 1.0;
        break;
      case 'revelation':
        this.ambientLight.intensity = 0.6;
        this.sunlight.intensity = 0.8;
        break;
    }
  }
}
```

## Input Handling

### Mouse/Touch Controls
```typescript
class InputHandler {
  private mouse: { x: number; y: number } = { x: 0, y: 0 };
  private mouseDown: boolean = false;
  private hoveredObject: InteractableObject | null = null;
  
  constructor(private canvas: HTMLCanvasElement) {
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('click', this.onClick.bind(this));
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
  }
  
  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
    
    // Check for hover
    this.checkHover();
  }
  
  private onClick(event: MouseEvent): void {
    if (this.hoveredObject) {
      this.hoveredObject.onExamine();
      this.hoveredObject.examined = true;
    }
  }
}
```

## Performance Optimization

### Object Pooling
```typescript
class ObjectPool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  
  constructor(
    private factory: () => T,
    private reset: (obj: T) => void,
    initialSize: number = 10
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.available.push(this.factory());
    }
  }
  
  acquire(): T {
    let obj = this.available.pop();
    if (!obj) {
      obj = this.factory();
    }
    this.inUse.add(obj);
    return obj;
  }
  
  release(obj: T): void {
    this.inUse.delete(obj);
    this.reset(obj);
    this.available.push(obj);
  }
}
```

### Level of Detail (LOD)
```typescript
class LODManager {
  setupLOD(object: THREE.Object3D): THREE.LOD {
    const lod = new THREE.LOD();
    
    // High detail (close)
    lod.addLevel(object, 0);
    
    // Medium detail (medium distance)
    const mediumDetail = this.createSimplifiedVersion(object, 0.5);
    lod.addLevel(mediumDetail, 5);
    
    // Low detail (far)
    const lowDetail = this.createSimplifiedVersion(object, 0.2);
    lod.addLevel(lowDetail, 10);
    
    return lod;
  }
}
```

### Texture Management
```typescript
class TextureManager {
  private cache: Map<string, THREE.Texture> = new Map();
  
  async loadTexture(url: string): Promise<THREE.Texture> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }
    
    const texture = await new THREE.TextureLoader().loadAsync(url);
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 4;
    this.cache.set(url, texture);
    return texture;
  }
  
  dispose(): void {
    this.cache.forEach(texture => texture.dispose());
    this.cache.clear();
  }
}
```

## Save/Load System

### Save Data Structure
```typescript
interface SaveData {
  version: string;
  timestamp: number;
  playerPosition: { x: number; y: number; z: number };
  cameraRotation: { x: number; y: number };
  storyFlags: Record<string, any>;
  discoveredObjects: string[];
  currentAct: number;
  playtime: number;
}

class SaveManager {
  private readonly SAVE_KEY = 'the_room_beyond_save';
  
  save(gameState: GameState): void {
    const saveData: SaveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      playerPosition: gameState.player.position,
      cameraRotation: gameState.camera.rotation,
      storyFlags: gameState.story.getAllFlags(),
      discoveredObjects: Array.from(gameState.story.discoveredObjects),
      currentAct: gameState.story.currentAct,
      playtime: gameState.playtime
    };
    
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
  }
  
  load(): SaveData | null {
    const data = localStorage.getItem(this.SAVE_KEY);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as SaveData;
    } catch (e) {
      console.error('Failed to parse save data:', e);
      return null;
    }
  }
  
  hasSave(): boolean {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }
  
  deleteSave(): void {
    localStorage.removeItem(this.SAVE_KEY);
  }
}
```

## Audio System

### Audio Manager
```typescript
interface AudioConfig {
  volume: number;
  loop: boolean;
  fadeIn?: number;
  fadeOut?: number;
}

class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private currentMusic: HTMLAudioElement | null = null;
  private masterVolume: number = 1.0;
  
  loadSound(id: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.addEventListener('canplaythrough', () => {
        this.sounds.set(id, audio);
        resolve();
      });
      audio.addEventListener('error', reject);
    });
  }
  
  playSound(id: string, config: Partial<AudioConfig> = {}): void {
    const sound = this.sounds.get(id);
    if (!sound) return;
    
    const clone = sound.cloneNode() as HTMLAudioElement;
    clone.volume = (config.volume ?? 1.0) * this.masterVolume;
    clone.loop = config.loop ?? false;
    
    if (config.fadeIn) {
      this.fadeIn(clone, config.fadeIn);
    }
    
    clone.play();
  }
  
  playMusic(id: string, fadeTime: number = 1000): void {
    if (this.currentMusic) {
      this.fadeOut(this.currentMusic, fadeTime);
    }
    
    const music = this.sounds.get(id);
    if (!music) return;
    
    this.currentMusic = music.cloneNode() as HTMLAudioElement;
    this.currentMusic.loop = true;
    this.currentMusic.volume = 0;
    this.currentMusic.play();
    this.fadeIn(this.currentMusic, fadeTime);
  }
  
  private fadeIn(audio: HTMLAudioElement, duration: number): void {
    const targetVolume = audio.volume || this.masterVolume;
    audio.volume = 0;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVolume);
      
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  }
  
  private fadeOut(audio: HTMLAudioElement, duration: number): void {
    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = startVolume / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0);
      
      if (currentStep >= steps) {
        clearInterval(interval);
        audio.pause();
      }
    }, stepTime);
  }
}
```

## TypeScript Configuration

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "types": ["jest", "node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@core/*": ["src/core/*"],
      "@entities/*": ["src/entities/*"],
      "@systems/*": ["src/systems/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## Testing Strategy

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*): '<rootDir>/src/$1',
    '^@core/(.*): '<rootDir>/src/core/$1',
    '^@entities/(.*): '<rootDir>/src/entities/$1',
    '^@systems/(.*): '<rootDir>/src/systems/$1',
    '^@utils/(.*): '<rootDir>/src/utils/$1',
    '^@types/(.*): '<rootDir>/src/types/$1'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Test Examples

#### Unit Test: Story System
```typescript
// tests/unit/StorySystem.test.ts
import { StorySystem } from '@systems/StorySystem';

describe('StorySystem', () => {
  let storySystem: StorySystem;
  
  beforeEach(() => {
    storySystem = new StorySystem();
  });
  
  describe('Flag Management', () => {
    test('should set and get flags correctly', () => {
      storySystem.setFlag('test_flag', true);
      expect(storySystem.getFlag('test_flag')).toBe(true);
    });
    
    test('should return undefined for non-existent flags', () => {
      expect(storySystem.getFlag('non_existent')).toBeUndefined();
    });
  });
  
  describe('Object Discovery', () => {
    test('should mark objects as discovered', () => {
      storySystem.discoverObject('alarm_clock');
      expect(storySystem.isDiscovered('alarm_clock')).toBe(true);
    });
    
    test('should trigger act progression after 3 discoveries', () => {
      const progressSpy = jest.spyOn(storySystem, 'checkStoryProgression');
      
      storySystem.discoverObject('object1');
      storySystem.discoverObject('object2');
      storySystem.discoverObject('object3');
      
      expect(progressSpy).toHaveBeenCalled();
      expect(storySystem.getFlag('act1_complete')).toBe(true);
    });
  });
  
  describe('Act Transitions', () => {
    test('should transition from Act 1 to Act 2', () => {
      expect(storySystem.currentAct).toBe(1);
      
      storySystem.setFlag('act1_complete', true);
      storySystem.transitionToAct(2);
      
      expect(storySystem.currentAct).toBe(2);
    });
  });
});
```

#### Integration Test: Interaction System
```typescript
// tests/integration/InteractionSystem.test.ts
import * as THREE from 'three';
import { InteractionSystem } from '@systems/InteractionSystem';
import { ObjectFactory } from '@entities/ObjectFactory';

describe('InteractionSystem Integration', () => {
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let interactionSystem: InteractionSystem;
  let objectFactory: ObjectFactory;
  
  beforeEach(() => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.set(0, 1.6, 0);
    
    interactionSystem = new InteractionSystem();
    objectFactory = new ObjectFactory();
  });
  
  test('should detect interactable object on click', () => {
    // Create an interactable object
    const phone = objectFactory.createPhone(new THREE.Vector3(0, 1, -2));
    scene.add(phone.mesh);
    
    // Simulate mouse click in center of screen
    const result = interactionSystem.checkInteraction(
      camera,
      400, // center x
      300, // center y
      [phone.mesh]
    );
    
    expect(result).not.toBeNull();
    expect(result?.id).toBe('phone');
  });
  
  test('should not detect object outside view', () => {
    const phone = objectFactory.createPhone(new THREE.Vector3(10, 1, -2));
    scene.add(phone.mesh);
    
    const result = interactionSystem.checkInteraction(
      camera,
      400,
      300,
      [phone.mesh]
    );
    
    expect(result).toBeNull();
  });
});
```

## Performance Requirements

### Target Metrics
- **Frame Rate:** Consistent 60 FPS
- **Initial Load:** < 3 seconds
- **Memory Usage:** < 200 MB
- **Draw Calls:** < 100 per frame
- **Triangles:** < 50,000 per frame

### Optimization Checklist
- [ ] Object pooling for particles/effects
- [ ] LOD for distant objects
- [ ] Texture atlasing where possible
- [ ] Frustum culling enabled
- [ ] Instanced rendering for repeated objects
- [ ] Compressed textures (if supported)
- [ ] Lazy loading for non-critical assets
- [ ] Event delegation for DOM listeners
- [ ] RequestAnimationFrame for game loop
- [ ] Web Workers for heavy computations (if needed)

## Accessibility Features

### Supported Features
```typescript
interface AccessibilitySettings {
  textSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reduceMotion: boolean;
  subtitles: boolean;
  screenReaderMode: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

class AccessibilityManager {
  private settings: AccessibilitySettings = {
    textSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    subtitles: true,
    screenReaderMode: false,
    colorBlindMode: 'none'
  };
  
  applySettings(): void {
    this.applyTextSize();
    this.applyHighContrast();
    this.applyReduceMotion();
    this.applyColorBlindMode();
  }
  
  private applyReduceMotion(): void {
    if (this.settings.reduceMotion) {
      // Disable camera shake, particle effects, etc.
    }
  }
}
```

## Build Configuration

### package.json
```json
{
  "name": "the-room-beyond",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  },
  "dependencies": {
    "three": "^0.128.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/three": "^0.128.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.45.0",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "prettier": "^3.0.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@systems': path.resolve(__dirname, './src/systems'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types')
    }
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

## Error Handling

### Global Error Handler
```typescript
class ErrorHandler {
  private static instance: ErrorHandler;
  
  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }
  
  setup(): void {
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
  }
  
  private handleError(event: ErrorEvent): void {
    console.error('Global error:', event.error);
    this.showErrorMessage('An unexpected error occurred. Please refresh the page.');
  }
  
  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    console.error('Unhandled promise rejection:', event.reason);
    this.showErrorMessage('An unexpected error occurred. Please refresh the page.');
  }
  
  private showErrorMessage(message: string): void {
    // Display user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
  }
}
```

## Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">
```

### Input Validation
```typescript
class InputValidator {
  static sanitizeString(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  
  static validateSaveData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    if (!data.version || typeof data.version !== 'string') return false;
    if (!data.timestamp || typeof data.timestamp !== 'number') return false;
    return true;
  }
}
```

## Deployment

### Build Process
1. Run tests: `npm test`
2. Lint code: `npm run lint`
3. Build production: `npm run build`
4. Output in `dist/` directory

### Hosting Requirements
- Static file hosting
- HTTPS enabled
- Gzip compression
- CDN for assets (optional)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
