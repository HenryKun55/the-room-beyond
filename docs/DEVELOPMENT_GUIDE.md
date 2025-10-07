# Development Guide - The Room Beyond
## Test-Driven Development Workflow

## Philosophy

**🚨 ABSOLUTE RULE: Test-Driven Development (TDD)**

**NEVER WRITE IMPLEMENTATION CODE WITHOUT TESTS FIRST. NO EXCEPTIONS.**

**Test-Driven Development (TDD)** means writing tests BEFORE implementation:
1. **Red** - Write a failing test FIRST - ALWAYS
2. **Green** - Write minimal code to pass the test
3. **Refactor** - Improve code while keeping tests green

**If you catch yourself writing implementation code without tests, STOP IMMEDIATELY and write tests first.**

This ensures:
- ✓ Every feature is tested
- ✓ Code is designed for testability
- ✓ Regression bugs are caught early
- ✓ Documentation through tests
- ✓ No accidental implementation without validation

## Development Environment Setup

### Initial Setup
```bash
# Clone/create project
mkdir the-room-beyond
cd the-room-beyond

# Initialize project
npm init -y

# Install dependencies
npm install three@0.128.0

# Install dev dependencies
npm install --save-dev \
  typescript@^5.2.0 \
  vite@^5.0.0 \
  jest@^29.5.0 \
  ts-jest@^29.1.0 \
  @types/jest@^29.5.0 \
  @types/three@^0.128.0 \
  @typescript-eslint/eslint-plugin@^6.0.0 \
  @typescript-eslint/parser@^6.0.0 \
  eslint@^8.45.0 \
  prettier@^3.0.0 \
  jest-environment-jsdom@^29.5.0

# Create directory structure
mkdir -p src/{core,entities,systems,scenes,utils,types}
mkdir -p tests/{unit,integration}
mkdir -p docs
mkdir -p public
```

### Configuration Files

#### package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "type-check": "tsc --noEmit"
  }
}
```

## TDD Development Cycle

### Phase 1: Core Foundation

#### Step 1.1: Game Class (TDD Example)

**Test First** (`tests/unit/Game.test.ts`):
```typescript
import { Game } from '@core/Game';

describe('Game', () => {
  let game: Game;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockCanvas = document.createElement('canvas');
    game = new Game(mockCanvas);
  });

  afterEach(() => {
    game.dispose();
  });

  describe('Initialization', () => {
    test('should initialize with canvas', () => {
      expect(game).toBeDefined();
      expect(game.renderer).toBeDefined();
      expect(game.scene).toBeDefined();
      expect(game.camera).toBeDefined();
    });

    test('should set correct canvas size', () => {
      expect(game.renderer.domElement.width).toBeGreaterThan(0);
      expect(game.renderer.domElement.height).toBeGreaterThan(0);
    });

    test('should initialize camera at correct position', () => {
      expect(game.camera.position.y).toBe(1.6);
      expect(game.camera.position.x).toBe(0);
      expect(game.camera.position.z).toBe(0);
    });
  });

  describe('Game Loop', () => {
    test('should start game loop', () => {
      const updateSpy = jest.spyOn(game as any, 'update');
      game.start();
      
      // Wait for next frame
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          expect(updateSpy).toHaveBeenCalled();
          game.stop();
          resolve(true);
        });
      });
    });

    test('should stop game loop', () => {
      game.start();
      const isRunning1 = game.isRunning();
      game.stop();
      const isRunning2 = game.isRunning();
      
      expect(isRunning1).toBe(true);
      expect(isRunning2).toBe(false);
    });

    test('should call update with delta time', () => {
      const updateSpy = jest.spyOn(game as any, 'update');
      game.start();
      
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          expect(updateSpy).toHaveBeenCalledWith(expect.any(Number));
          game.stop();
          resolve(true);
        });
      });
    });
  });

  describe('Resize', () => {
    test('should handle window resize', () => {
      const newWidth = 1024;
      const newHeight = 768;
      
      game.handleResize(newWidth, newHeight);
      
      expect(game.camera.aspect).toBe(newWidth / newHeight);
      expect(game.renderer.domElement.width).toBe(newWidth);
      expect(game.renderer.domElement.height).toBe(newHeight);
    });
  });
});
```

**Implementation** (`src/core/Game.ts`):
```typescript
import * as THREE from 'three';

export class Game {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  
  private running: boolean = false;
  private lastTime: number = 0;
  private animationId: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 1.6, 0);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  stop(): void {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  isRunning(): boolean {
    return this.running;
  }

  private gameLoop(currentTime: number): void {
    if (!this.running) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number): void {
    // Will be extended with game logic
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  handleResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose(): void {
    this.stop();
    this.renderer.dispose();
    this.scene.clear();
  }
}
```

**Run Test**:
```bash
npm test -- Game.test.ts
```

Expected: All tests pass ✓

#### Step 1.2: Input Handler (TDD)

**Test First** (`tests/unit/InputHandler.test.ts`):
```typescript
import { InputHandler } from '@core/InputHandler';

describe('InputHandler', () => {
  let inputHandler: InputHandler;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockCanvas = document.createElement('canvas');
    document.body.appendChild(mockCanvas);
    inputHandler = new InputHandler(mockCanvas);
  });

  afterEach(() => {
    inputHandler.dispose();
    document.body.removeChild(mockCanvas);
  });

  describe('Mouse Events', () => {
    test('should track mouse position', () => {
      const event = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200
      });
      mockCanvas.dispatchEvent(event);

      const mousePos = inputHandler.getMousePosition();
      expect(mousePos.x).toBe(100);
      expect(mousePos.y).toBe(200);
    });

    test('should detect mouse click', () => {
      const callback = jest.fn();
      inputHandler.onClick(callback);

      const event = new MouseEvent('click', {
        clientX: 50,
        clientY: 50
      });
      mockCanvas.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(50, 50);
    });

    test('should detect mouse down and up', () => {
      const downEvent = new MouseEvent('mousedown');
      const upEvent = new MouseEvent('mouseup');

      mockCanvas.dispatchEvent(downEvent);
      expect(inputHandler.isMouseDown()).toBe(true);

      mockCanvas.dispatchEvent(upEvent);
      expect(inputHandler.isMouseDown()).toBe(false);
    });
  });

  describe('Keyboard Events', () => {
    test('should track key press', () => {
      const event = new KeyboardEvent('keydown', { key: 'w' });
      window.dispatchEvent(event);

      expect(inputHandler.isKeyPressed('w')).toBe(true);
    });

    test('should track key release', () => {
      const downEvent = new KeyboardEvent('keydown', { key: 'a' });
      const upEvent = new KeyboardEvent('keyup', { key: 'a' });

      window.dispatchEvent(downEvent);
      expect(inputHandler.isKeyPressed('a')).toBe(true);

      window.dispatchEvent(upEvent);
      expect(inputHandler.isKeyPressed('a')).toBe(false);
    });

    test('should track multiple keys simultaneously', () => {
      const w = new KeyboardEvent('keydown', { key: 'w' });
      const a = new KeyboardEvent('keydown', { key: 'a' });

      window.dispatchEvent(w);
      window.dispatchEvent(a);

      expect(inputHandler.isKeyPressed('w')).toBe(true);
      expect(inputHandler.isKeyPressed('a')).toBe(true);
    });
  });

  describe('Event Cleanup', () => {
    test('should remove event listeners on dispose', () => {
      const callback = jest.fn();
      inputHandler.onClick(callback);
      inputHandler.dispose();

      const event = new MouseEvent('click');
      mockCanvas.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
```

**Implementation** (`src/core/InputHandler.ts`):
```typescript
export class InputHandler {
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseDown: boolean = false;
  private keysPressed: Set<string> = new Set();
  private clickCallbacks: Array<(x: number, y: number) => void> = [];
  
  private mouseMoveHandler: (e: MouseEvent) => void;
  private mouseDownHandler: (e: MouseEvent) => void;
  private mouseUpHandler: (e: MouseEvent) => void;
  private clickHandler: (e: MouseEvent) => void;
  private keyDownHandler: (e: KeyboardEvent) => void;
  private keyUpHandler: (e: KeyboardEvent) => void;

  constructor(private canvas: HTMLCanvasElement) {
    // Bind handlers
    this.mouseMoveHandler = this.onMouseMove.bind(this);
    this.mouseDownHandler = this.onMouseDown.bind(this);
    this.mouseUpHandler = this.onMouseUp.bind(this);
    this.clickHandler = this.onClick.bind(this);
    this.keyDownHandler = this.onKeyDown.bind(this);
    this.keyUpHandler = this.onKeyUp.bind(this);

    // Add event listeners
    this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.addEventListener('mousedown', this.mouseDownHandler);
    this.canvas.addEventListener('mouseup', this.mouseUpHandler);
    this.canvas.addEventListener('click', this.clickHandler);
    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
  }

  private onMouseMove(event: MouseEvent): void {
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  private onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
  }

  private onMouseUp(event: MouseEvent): void {
    this.mouseDown = false;
  }

  private onClick(event: MouseEvent): void {
    this.clickCallbacks.forEach(callback => {
      callback(event.clientX, event.clientY);
    });
  }

  private onKeyDown(event: KeyboardEvent): void {
    this.keysPressed.add(event.key.toLowerCase());
  }

  private onKeyUp(event: KeyboardEvent): void {
    this.keysPressed.delete(event.key.toLowerCase());
  }

  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  isMouseDown(): boolean {
    return this.mouseDown;
  }

  isKeyPressed(key: string): boolean {
    return this.keysPressed.has(key.toLowerCase());
  }

  onClick(callback: (x: number, y: number) => void): void {
    this.clickCallbacks.push(callback);
  }

  dispose(): void {
    this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
    this.canvas.removeEventListener('mouseup', this.mouseUpHandler);
    this.canvas.removeEventListener('click', this.clickHandler);
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
    this.clickCallbacks = [];
    this.keysPressed.clear();
  }
}
```

#### Step 1.3: Story System (TDD)

**Test First** (`tests/unit/StorySystem.test.ts`):
```typescript
import { StorySystem } from '@systems/StorySystem';

describe('StorySystem', () => {
  let storySystem: StorySystem;

  beforeEach(() => {
    storySystem = new StorySystem();
  });

  describe('Flag Management', () => {
    test('should set and get flags', () => {
      storySystem.setFlag('test_flag', true);
      expect(storySystem.getFlag('test_flag')).toBe(true);
    });

    test('should support different flag types', () => {
      storySystem.setFlag('bool_flag', true);
      storySystem.setFlag('number_flag', 42);
      storySystem.setFlag('string_flag', 'hello');

      expect(storySystem.getFlag('bool_flag')).toBe(true);
      expect(storySystem.getFlag('number_flag')).toBe(42);
      expect(storySystem.getFlag('string_flag')).toBe('hello');
    });

    test('should return undefined for non-existent flags', () => {
      expect(storySystem.getFlag('non_existent')).toBeUndefined();
    });

    test('should update existing flags', () => {
      storySystem.setFlag('counter', 1);
      storySystem.setFlag('counter', 2);
      expect(storySystem.getFlag('counter')).toBe(2);
    });
  });

  describe('Object Discovery', () => {
    test('should mark object as discovered', () => {
      storySystem.discoverObject('phone');
      expect(storySystem.isDiscovered('phone')).toBe(true);
    });

    test('should not discover same object twice', () => {
      storySystem.discoverObject('phone');
      storySystem.discoverObject('phone');
      expect(storySystem.getDiscoveredCount()).toBe(1);
    });

    test('should track multiple discoveries', () => {
      storySystem.discoverObject('phone');
      storySystem.discoverObject('laptop');
      storySystem.discoverObject('journal');
      expect(storySystem.getDiscoveredCount()).toBe(3);
    });

    test('should return false for undiscovered objects', () => {
      expect(storySystem.isDiscovered('mystery_item')).toBe(false);
    });
  });

  describe('Act Progression', () => {
    test('should start at Act 1', () => {
      expect(storySystem.getCurrentAct()).toBe(1);
    });

    test('should transition to Act 2 after 3 discoveries', () => {
      storySystem.discoverObject('alarm_clock');
      storySystem.discoverObject('phone');
      storySystem.discoverObject('medicine');

      expect(storySystem.getFlag('act1_complete')).toBe(true);
      expect(storySystem.canProgressToNextAct()).toBe(true);
    });

    test('should transition to Act 3 after finding critical items', () => {
      // Setup Act 2 complete
      storySystem.setFlag('act1_complete', true);
      storySystem.setFlag('laptop_accessed', true);
      storySystem.setFlag('vr_examined', true);
      storySystem.setFlag('photo_examined', true);

      storySystem.checkActProgression();
      
      expect(storySystem.getFlag('act2_complete')).toBe(true);
    });

    test('should manually transition acts', () => {
      storySystem.transitionToAct(2);
      expect(storySystem.getCurrentAct()).toBe(2);
    });

    test('should not allow skipping acts', () => {
      expect(() => storySystem.transitionToAct(3)).toThrow();
    });
  });

  describe('Story Events', () => {
    test('should emit events on flag changes', () => {
      const callback = jest.fn();
      storySystem.on('flagChanged', callback);

      storySystem.setFlag('test', true);

      expect(callback).toHaveBeenCalledWith({
        flag: 'test',
        value: true
      });
    });

    test('should emit events on discovery', () => {
      const callback = jest.fn();
      storySystem.on('objectDiscovered', callback);

      storySystem.discoverObject('phone');

      expect(callback).toHaveBeenCalledWith({
        objectId: 'phone',
        totalDiscovered: 1
      });
    });

    test('should emit events on act transition', () => {
      const callback = jest.fn();
      storySystem.on('actChanged', callback);

      storySystem.transitionToAct(2);

      expect(callback).toHaveBeenCalledWith({
        previousAct: 1,
        currentAct: 2
      });
    });
  });

  describe('Save/Load State', () => {
    test('should export state', () => {
      storySystem.setFlag('test', true);
      storySystem.discoverObject('phone');

      const state = storySystem.exportState();

      expect(state.flags.test).toBe(true);
      expect(state.discoveredObjects).toContain('phone');
      expect(state.currentAct).toBe(1);
    });

    test('should import state', () => {
      const state = {
        flags: { test: true, count: 5 },
        discoveredObjects: ['phone', 'laptop'],
        currentAct: 2
      };

      storySystem.importState(state);

      expect(storySystem.getFlag('test')).toBe(true);
      expect(storySystem.getFlag('count')).toBe(5);
      expect(storySystem.isDiscovered('phone')).toBe(true);
      expect(storySystem.getCurrentAct()).toBe(2);
    });
  });
});
```

**Implementation** (`src/systems/StorySystem.ts`):
```typescript
type StoryEventType = 'flagChanged' | 'objectDiscovered' | 'actChanged';
type EventCallback = (data: any) => void;

interface StoryState {
  flags: Record<string, any>;
  discoveredObjects: string[];
  currentAct: number;
}

export class StorySystem {
  private flags: Map<string, any> = new Map();
  private discoveredObjects: Set<string> = new Set();
  private currentAct: number = 1;
  private eventListeners: Map<StoryEventType, EventCallback[]> = new Map();

  constructor() {
    // Initialize event listeners
    this.eventListeners.set('flagChanged', []);
    this.eventListeners.set('objectDiscovered', []);
    this.eventListeners.set('actChanged', []);
  }

  // Flag Management
  setFlag(key: string, value: any): void {
    this.flags.set(key, value);
    this.emit('flagChanged', { flag: key, value });
    this.checkActProgression();
  }

  getFlag(key: string): any {
    return this.flags.get(key);
  }

  getAllFlags(): Record<string, any> {
    const result: Record<string, any> = {};
    this.flags.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // Object Discovery
  discoverObject(objectId: string): void {
    if (this.discoveredObjects.has(objectId)) return;
    
    this.discoveredObjects.add(objectId);
    this.emit('objectDiscovered', {
      objectId,
      totalDiscovered: this.discoveredObjects.size
    });
    this.checkActProgression();
  }

  isDiscovered(objectId: string): boolean {
    return this.discoveredObjects.has(objectId);
  }

  getDiscoveredCount(): number {
    return this.discoveredObjects.size;
  }

  // Act Progression
  getCurrentAct(): number {
    return this.currentAct;
  }

  transitionToAct(act: number): void {
    if (act === this.currentAct + 1 || act === 2 && this.currentAct === 1) {
      const previousAct = this.currentAct;
      this.currentAct = act;
      this.emit('actChanged', { previousAct, currentAct: act });
    } else {
      throw new Error(`Cannot skip to act ${act} from act ${this.currentAct}`);
    }
  }

  canProgressToNextAct(): boolean {
    if (this.currentAct === 1) {
      return this.getFlag('act1_complete') === true;
    }
    if (this.currentAct === 2) {
      return this.getFlag('act2_complete') === true;
    }
    return false;
  }

  checkActProgression(): void {
    // Act 1 -> Act 2: Discover 3 objects
    if (this.currentAct === 1 && this.discoveredObjects.size >= 3) {
      this.setFlag('act1_complete', true);
    }

    // Act 2 -> Act 3: Critical items examined
    if (this.currentAct === 2) {
      const criticalItems = [
        'laptop_accessed',
        'vr_examined',
        'photo_examined'
      ];
      const allCriticalExamined = criticalItems.every(item => 
        this.getFlag(item) === true
      );

      if (allCriticalExamined) {
        this.setFlag('act2_complete', true);
      }
    }
  }

  // Event System
  on(event: StoryEventType, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.push(callback);
    }
  }

  off(event: StoryEventType, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: StoryEventType, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Save/Load
  exportState(): StoryState {
    return {
      flags: this.getAllFlags(),
      discoveredObjects: Array.from(this.discoveredObjects),
      currentAct: this.currentAct
    };
  }

  importState(state: StoryState): void {
    this.flags.clear();
    this.discoveredObjects.clear();

    Object.entries(state.flags).forEach(([key, value]) => {
      this.flags.set(key, value);
    });

    state.discoveredObjects.forEach(obj => {
      this.discoveredObjects.add(obj);
    });

    this.currentAct = state.currentAct;
  }
}
```

### Phase 2: Integration Testing

#### Integration Test: Game with Story System

**Test** (`tests/integration/GameStoryIntegration.test.ts`):
```typescript
import { Game } from '@core/Game';
import { StorySystem } from '@systems/StorySystem';
import { InteractionSystem } from '@systems/InteractionSystem';

describe('Game + Story Integration', () => {
  let game: Game;
  let storySystem: StorySystem;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    game = new Game(canvas);
    storySystem = new StorySystem();
  });

  afterEach(() => {
    game.dispose();
  });

  test('should progress through acts via discoveries', () => {
    expect(storySystem.getCurrentAct()).toBe(1);

    // Discover enough objects to trigger Act 2
    storySystem.discoverObject('alarm_clock');
    storySystem.discoverObject('phone');
    storySystem.discoverObject('medicine');

    expect(storySystem.getFlag('act1_complete')).toBe(true);
    expect(storySystem.canProgressToNextAct()).toBe(true);

    storySystem.transitionToAct(2);
    expect(storySystem.getCurrentAct()).toBe(2);
  });

  test('should track complete playthrough', () => {
    const discoveries: string[] = [];
    
    storySystem.on('objectDiscovered', (data) => {
      discoveries.push(data.objectId);
    });

    // Simulate playthrough
    const objects = [
      'alarm_clock', 'phone', 'medicine',
      'journal', 'laptop', 'vr_headset',
      'photo', 'medical_report'
    ];

    objects.forEach(obj => storySystem.discoverObject(obj));

    expect(discoveries.length).toBe(8);
    expect(storySystem.getDiscoveredCount()).toBe(8);
  });
});
```

## Development Workflow (Step-by-Step)

### Week 1: Foundation
```
Day 1-2: Core Systems
├─ Write tests for Game class
├─ Implement Game class
├─ Write tests for InputHandler
├─ Implement InputHandler
└─ Verify all tests pass

Day 3-4: Story & Interaction
├─ Write tests for StorySystem
├─ Implement StorySystem
├─ Write tests for InteractionSystem
├─ Implement InteractionSystem (basic raycasting)
└─ Integration tests

Day 5: Scene Setup
├─ Write tests for SceneManager
├─ Implement SceneManager
├─ Create basic room geometry
└─ Test scene switching
```

### Week 2: Content Creation
```
Day 1-2: Object Factory
├─ Write tests for object creation
├─ Implement ObjectFactory
├─ Create 5 core objects (procedurally)
└─ Test object interactions

Day 3-4: Dialogue System
├─ Write tests for DialogueSystem
├─ Implement DialogueSystem
├─ Create dialogue trees
└─ Test dialogue flow

Day 5: Integration
├─ Connect all systems
├─ Test full interaction loop
└─ Bug fixes
```

### Week 3: Polish & Testing
```
Day 1-2: UI Implementation
├─ Create UI components
├─ Test UI responsiveness
├─ Implement accessibility features
└─ Test keyboard navigation

Day 3-4: Content Completion
├─ All 20 objects implemented
├─ All dialogue written
├─ Flashback sequences
└─ Both endings

Day 5: Full Playthrough Testing
├─ Complete playtesting
├─ Performance profiling
├─ Bug fixes
└─ Final polish
```

## Testing Best Practices

### 1. Test Organization
```
tests/
├─ unit/                    # Isolated component tests
│   ├─ core/
│   ├─ systems/
│   ├─ entities/
│   └─ utils/
├─ integration/             # Multiple components together
│   ├─ GameStoryIntegration.test.ts
│   └─ FullPlaythrough.test.ts
└─ helpers/                 # Test utilities
    ├─ mockCanvas.ts
    └─ testHelpers.ts
```

### 2. Test Coverage Goals
```
Core Systems:     95%+ coverage
Game Logic:       90%+ coverage
UI Components:    80%+ coverage
Utils:            100% coverage
Overall:          90%+ coverage
```

### 3. Mock Strategies
```typescript
// Mock Three.js when needed
jest.mock('three', () => ({
  Scene: jest.fn(),
  PerspectiveCamera: jest.fn(),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn()
  }))
}));

// Mock canvas
const createMockCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  return canvas;
};
```

### 4. Test Data
```typescript
// Test fixtures
export const TEST_OBJECTS = {
  phone: {
    id: 'phone',
    name: 'Smartphone',
    position: { x: 3.7, y: 0.52, z: -1 }
  },
  laptop: {
    id: 'laptop',
    name: 'Laptop',
    position: { x: -2.8, y: 0.75, z: -3 }
  }
};

export const TEST_DIALOGUE = {
  intro: {
    id: 'intro',
    speaker: 'Elena',
    text: 'My head... what time is it?'
  }
};
```

## Debugging Strategies

### 1. Console Debugging
```typescript
// Development mode only
if (process.env.NODE_ENV === 'development') {
  console.log('[StorySystem] Flag changed:', flag, value);
  console.log('[InteractionSystem] Object clicked:', object.id);
}
```

### 2. Visual Debugging
```typescript
// Show raycasts
if (DEBUG_MODE) {
  const arrowHelper = new THREE.ArrowHelper(
    raycaster.ray.direction,
    raycaster.ray.origin,
    10,
    0xff0000
  );
  scene.add(arrowHelper);
}

// Show interaction bounds
if (DEBUG_MODE) {
  const boxHelper = new THREE.BoxHelper(object, 0x00ff00);
  scene.add(boxHelper);
}
```

### 3. Performance Profiling
```typescript
// Measure frame time
const startTime = performance.now();
this.update(deltaTime);
const endTime = performance.now();

if (endTime - startTime > 16.67) { // > 60 FPS
  console.warn(`Slow frame: ${endTime - startTime}ms`);
}
```

## Code Quality Checklist

Before committing code:
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Test coverage maintained (`npm run test:coverage`)
- [ ] No console.log statements (except debug mode)
- [ ] Comments added for complex logic
- [ ] Performance is acceptable (60 FPS)

## Git Workflow

### Branch Strategy
```
main
├─ develop
│   ├─ feature/story-system
│   ├─ feature/interaction-system
│   └─ feature/dialogue-system
└─ hotfix/critical-bug
```

### Commit Messages
```
feat: Add StorySystem with flag management
test: Add tests for object discovery
fix: Correct raycasting intersection detection
refactor: Improve InputHandler performance
docs: Update API documentation
```

## Continuous Integration

### GitHub Actions (example)
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Documentation Standards

### Code Documentation
```typescript
/**
 * Discovers a new object and updates story progression
 * 
 * @param objectId - Unique identifier for the object
 * @throws {Error} If objectId is invalid
 * @fires StorySystem#objectDiscovered
 * 
 * @example
 * storySystem.discoverObject('phone');
 */
discoverObject(objectId: string): void {
  // Implementation
}
```

### API Documentation
Generate with TypeDoc:
```bash
npm install --save-dev typedoc
npx typedoc --out docs/api src
```

## Final Checklist Before Launch

### Functionality
- [ ] All 20 objects interact correctly
- [ ] Story progresses through all acts
- [ ] Both endings are reachable
- [ ] Save/load works correctly
- [ ] No game-breaking bugs

### Performance
- [ ] Maintains 60 FPS
- [ ] Loads in under 3 seconds
- [ ] Memory usage under 200MB
- [ ] No memory leaks

### Quality
- [ ] Test coverage > 90%
- [ ] All tests passing
- [ ] No console errors
- [ ] Code is linted and formatted
- [ ] Documentation is complete

### Accessibility
- [ ] Keyboard navigation works
- [ ] High contrast mode functional
- [ ] Subtitles implemented
- [ ] Colorblind modes tested
- [ ] Screen reader compatible (basic)

### Cross-browser
- [ ] Chrome tested
- [ ] Firefox tested
- [ ] Safari tested
- [ ] Edge tested

---

## Summary

This TDD workflow ensures:
1. **Quality**: Every feature is tested
2. **Confidence**: Refactoring is safe
3. **Documentation**: Tests show how to use code
4. **Speed**: Catch bugs early
5. **Maintainability**: Clean, testable architecture

**Next Steps**: Begin with Phase 1, writing tests first for each component before implementation. Follow the Red-Green-Refactor cycle religiously.

**Remember**: Tests are not a burden—they're your safety net and documentation combined.
