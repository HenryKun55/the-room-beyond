# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: Always Read Documentation First

**BEFORE taking any action in this repository, you MUST:**

1. **Read `docs/` folder contents** - Contains all project specifications
2. **Read `PROJECT_OVERVIEW.md`** - Core project concept and structure  
3. **Read `README.md`** - Complete development workflow and commands

**NEVER deviate from the established patterns, architecture, or requirements defined in these documents.**

### Required Documentation Files:
- `docs/STORY.md` - Complete narrative and dialogue
- `docs/GAME_DESIGN.md` - Game mechanics and progression
- `docs/TECHNICAL_SPEC.md` - Technical architecture and patterns
- `docs/ART_DIRECTION.md` - Visual style and 3D specifications
- `docs/DEVELOPMENT_GUIDE.md` - TDD workflow and best practices
- `PROJECT_OVERVIEW.md` - High-level project concept
- `README.md` - Development commands and setup

## About The Room Beyond

**The Room Beyond** is a 20-30 minute first-person psychological mystery game about agoraphobia, memory, and the courage to face fears. Built with TypeScript, Three.js, and following Test-Driven Development practices.

## Development Commands

### Core Development Workflow
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking (run before committing)
npm run type-check
```

### Testing Commands
```bash
# Run all tests
npm test

# Watch mode (recommended during development)
npm run test:watch

# Generate coverage report (target: 90%+ overall)
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration

# Run specific test file
npm test -- StorySystem.test.ts
```

### Code Quality Commands
```bash
# Lint TypeScript files
npm run lint

# Lint and auto-fix issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Run all quality checks before committing
npm run lint && npm run type-check && npm test
```

## Architecture Overview

### Core Design Principles
- **Test-Driven Development (TDD)**: Write tests first, then implement
- **Entity-Component System**: Modular, testable components
- **Event-Driven Architecture**: Systems communicate via events
- **No External Assets**: All visuals created procedurally with Three.js

### System Dependencies
```
Game (main controller)
├── SceneManager (scene switching)
├── InputHandler (mouse/keyboard input)
├── StorySystem (narrative progression)
├── InteractionSystem (raycasting)
├── DialogueSystem (conversation management)
└── SaveManager (localStorage persistence)
```

### Key Directories
- `src/core/` - Core game systems (Game, SceneManager, InputHandler)
- `src/systems/` - Game logic systems (Story, Dialogue, Interaction)
- `src/entities/` - Game objects (Player, InteractableObject, ObjectFactory)
- `src/scenes/` - Scene implementations (MainRoom, MenuScene)
- `src/utils/` - Utility functions (AudioManager, LightingManager)
- `src/types/` - TypeScript interfaces and types
- `tests/unit/` - Unit tests for individual components
- `tests/integration/` - Integration tests for system interactions
- `docs/` - Comprehensive game documentation

### TypeScript Path Aliases
```typescript
@/* - src/*
@core/* - src/core/*
@entities/* - src/entities/*
@systems/* - src/systems/*
@utils/* - src/utils/*
@types/* - src/types/*
```

## Development Workflow

### TDD Cycle (Critical)
1. **Red**: Write failing test first
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve while keeping tests green

### Code Quality Requirements
- **Test Coverage**: Maintain 90%+ overall coverage
- **TypeScript**: Strict mode enabled, no `any` types
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier for consistent style

### Performance Targets
- **Frame Rate**: Consistent 60 FPS
- **Load Time**: < 3 seconds initial load
- **Memory**: < 200 MB usage
- **Triangles**: < 50,000 per frame

## Story System Architecture

### Progression Mechanics
- **Act 1**: Triggered by discovering 3 objects
- **Act 2**: Triggered by examining critical items (laptop, VR headset, photo)
- **Act 3**: Final choice leading to two distinct endings

### Flag System
```typescript
// Set story flags
storySystem.setFlag('laptop_accessed', true);
storySystem.setFlag('vr_examined', true);

// Check progression
if (storySystem.getFlag('act1_complete')) {
  // Transition to Act 2
}
```

### Object Discovery
- 20 interactive objects total
- Each discovery triggers story events
- Progress tracked via `discoveredObjects` Set

## Testing Patterns

### Unit Test Structure
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  
  beforeEach(() => {
    component = new ComponentName();
  });
  
  afterEach(() => {
    component.dispose();
  });
  
  describe('Feature Group', () => {
    test('should do specific thing', () => {
      // Arrange, Act, Assert
    });
  });
});
```

### Integration Testing
- Test system interactions (Game + Story, Interaction + Dialogue)
- Mock Three.js components when necessary
- Use test fixtures for consistent data

### Coverage Goals
- Core Systems: 95%+
- Game Logic: 90%+
- UI Components: 80%+
- Utils: 100%

## Three.js Implementation

### Procedural Generation
All 3D objects created programmatically:
```typescript
// Example: Alarm clock
const clockBody = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 0.15, 0.2),
  new THREE.MeshStandardMaterial({ color: 0x2C3E50 })
);
```

### Performance Optimizations
- Object pooling for effects
- LOD (Level of Detail) for distant objects
- Frustum culling enabled
- Texture atlasing where possible

### Lighting Strategy
- Ambient light for base illumination
- Directional light for sunlight through window
- Point lights for desk lamp and mood lighting
- Dynamic lighting changes based on story progression

## Accessibility Features

### Supported Modes
- Keyboard-only navigation
- High contrast mode
- Reduce motion settings
- Subtitle support
- Basic screen reader compatibility
- Colorblind support (Protanopia, Deuteranopia, Tritanopia)

### Implementation
```typescript
// Check accessibility settings
if (accessibilitySettings.reduceMotion) {
  // Disable camera shake, particles
}
```

## Save System

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
```

### localStorage Management
- Auto-save on story progression
- Manual save/load via menu
- Save validation and version checking

## Common Development Tasks

### Adding a New Interactive Object
1. Write tests in `tests/unit/ObjectFactory.test.ts`
2. Implement object creation in `src/entities/ObjectFactory.ts`
3. Add interaction logic in `src/systems/InteractionSystem.ts`
4. Update story progression in `src/systems/StorySystem.ts`
5. Add dialogue in dialogue tree

### Adding Story Content
1. Write tests for new story flags
2. Update `StorySystem.ts` with new progression logic
3. Add dialogue nodes to `DialogueSystem.ts`
4. Test story flow with integration tests

### Performance Debugging
```typescript
// Enable debug mode
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  // Show FPS counter
  // Display collision boxes
  // Log interactions
}
```

## Browser Support

### Minimum Requirements
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- WebGL 2.0 support
- JavaScript enabled
- 1280x720 minimum resolution

### Testing Strategy
- Test on all major browsers
- Verify WebGL compatibility
- Check performance on lower-end hardware

## Deployment Process

### Build Steps
1. Run all tests: `npm test`
2. Type check: `npm run type-check`
3. Lint: `npm run lint`
4. Build: `npm run build`
5. Output in `dist/` directory

### Environment Variables
```env
VITE_DEBUG_MODE=true
VITE_SKIP_INTRO=false
VITE_TARGET_FPS=60
VITE_ENABLE_STATS=true
```

## Troubleshooting

### Common Issues
- **Black screen**: Clear cache, rebuild with `npm run build`
- **TypeScript errors**: Run `npm run type-check`
- **Test failures**: Clear Jest cache with `npm test -- --clearCache`
- **Performance issues**: Check frame rate, enable debug mode

### Debug Tools
- Browser DevTools for Three.js inspection
- Jest coverage reports
- ESLint for code quality
- TypeScript compiler for type checking