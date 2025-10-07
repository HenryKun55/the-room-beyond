# The Room Beyond

> A 20-30 minute first-person psychological mystery game about agoraphobia, memory, and the courage to face our fears.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-r128-orange.svg)

## 🎮 About

**The Room Beyond** is a narrative-driven game where you play as Dr. Elena Voss, a psychologist with severe agoraphobia who must unravel the truth about her breakthrough VR treatment by exploring the only space she can access—her own room.

### Key Features
- 🎭 **Deep Psychological Narrative** - Explore themes of trauma, guilt, and healing
- 🎨 **Procedurally Generated 3D** - All visuals created with Three.js primitives (no external assets)
- 🎯 **Two Meaningful Endings** - Your choice determines Elena's fate
- ♿ **Accessibility First** - Built with accessibility features from the ground up
- 🧪 **Test-Driven Development** - 90%+ test coverage with Jest
- ⚡ **Browser-Based** - Runs directly in modern web browsers, no installation needed

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Development](#-development)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Game Controls](#-game-controls)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+ or yarn 1.22+
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Install and Run

```bash
# Clone the repository
git clone https://github.com/yourusername/the-room-beyond.git
cd the-room-beyond

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser (usually http://localhost:3000)
```

### Build for Production

```bash
# Build the game
npm run build

# Preview production build
npm run preview
```

## 📦 Installation

### Detailed Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/the-room-beyond.git
   cd the-room-beyond
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Installation**
   ```bash
   # Run tests
   npm test
   
   # Check TypeScript compilation
   npm run type-check
   
   # Lint code
   npm run lint
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
# Development
VITE_DEBUG_MODE=true
VITE_SKIP_INTRO=false

# Performance
VITE_TARGET_FPS=60
VITE_ENABLE_STATS=true
```

## 🛠️ Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run test:unit` | Run only unit tests |
| `npm run test:integration` | Run only integration tests |
| `npm run lint` | Lint TypeScript files |
| `npm run lint:fix` | Lint and auto-fix issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |

### Development Workflow

This project follows **Test-Driven Development (TDD)**:

1. **Write a failing test** (Red)
   ```bash
   npm run test:watch
   ```

2. **Write minimal code to pass** (Green)
   ```typescript
   // Implement feature
   ```

3. **Refactor while keeping tests green** (Refactor)
   ```bash
   npm run lint:fix
   npm run format
   ```

See [DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md) for detailed TDD workflow.

### Code Quality

Before committing:

```bash
# Run all quality checks
npm run lint && npm run type-check && npm test
```

Or use the pre-commit hook (install with Husky):

```bash
npx husky install
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (recommended during development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- StorySystem.test.ts
```

### Test Coverage Goals

- **Core Systems**: 95%+ coverage
- **Game Logic**: 90%+ coverage
- **UI Components**: 80%+ coverage
- **Utils**: 100% coverage
- **Overall**: 90%+ coverage

### Writing Tests

Example test structure:

```typescript
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
  });
});
```

See [DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md) for more testing examples.

## 📁 Project Structure

```
the-room-beyond/
├── docs/                          # Documentation
│   ├── STORY.md                   # Complete narrative & dialogue
│   ├── GAME_DESIGN.md             # Game design document
│   ├── TECHNICAL_SPEC.md          # Technical specifications
│   ├── ART_DIRECTION.md           # Visual style guide
│   └── DEVELOPMENT_GUIDE.md       # TDD workflow & best practices
├── src/
│   ├── core/                      # Core game systems
│   │   ├── Game.ts                # Main game controller
│   │   ├── SceneManager.ts        # Scene management
│   │   └── InputHandler.ts        # Input processing
│   ├── entities/                  # Game entities
│   │   ├── Player.ts              # Player controller
│   │   ├── InteractableObject.ts  # Interactive objects
│   │   └── ObjectFactory.ts       # Object creation
│   ├── systems/                   # Game systems
│   │   ├── DialogueSystem.ts      # Dialogue management
│   │   ├── StorySystem.ts         # Story progression
│   │   ├── InteractionSystem.ts   # Object interaction
│   │   └── SaveManager.ts         # Save/load system
│   ├── scenes/                    # Game scenes
│   │   ├── MainRoom.ts            # Primary game scene
│   │   └── MenuScene.ts           # Menu scene
│   ├── utils/                     # Utility functions
│   │   ├── AudioManager.ts        # Audio management
│   │   └── LightingManager.ts     # Lighting control
│   ├── types/                     # TypeScript types
│   │   └── interfaces.ts          # Shared interfaces
│   └── main.ts                    # Entry point
├── tests/
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── helpers/                   # Test utilities
├── public/
│   ├── index.html                 # HTML entry point
│   └── styles.css                 # Global styles
├── package.json
├── tsconfig.json
├── jest.config.js
├── vite.config.ts
└── README.md
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[STORY.md](./docs/STORY.md)** - Complete narrative, all dialogue, both endings, character profiles
- **[GAME_DESIGN.md](./docs/GAME_DESIGN.md)** - Gameplay mechanics, progression systems, player psychology
- **[TECHNICAL_SPEC.md](./docs/TECHNICAL_SPEC.md)** - Architecture, systems, code examples, performance specs
- **[ART_DIRECTION.md](./docs/ART_DIRECTION.md)** - Visual style, color palette, 3D object specifications
- **[DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md)** - TDD workflow, testing examples, best practices

## 🎮 Game Controls

### Mouse & Keyboard

| Control | Action |
|---------|--------|
| **Mouse Move** | Look around |
| **Left Click** | Interact with objects |
| **W / ↑** | Move forward |
| **S / ↓** | Move backward |
| **A / ←** | Move left |
| **D / →** | Move right |
| **ESC** | Pause menu |
| **Tab** | Toggle inventory (if collected items) |
| **E** | Examine object (when highlighted) |

### Accessibility

- **Keyboard Only**: Full game playable without mouse
- **Screen Reader**: Basic screen reader support
- **Subtitles**: Enabled by default
- **High Contrast**: Toggle in settings
- **Reduce Motion**: Disable animations in settings
- **Colorblind Modes**: Protanopia, Deuteranopia, Tritanopia

Access settings via the pause menu (ESC).

## 🌐 Browser Support

| Browser | Minimum Version | Recommended |
|---------|----------------|-------------|
| Chrome | 90+ | Latest |
| Firefox | 88+ | Latest |
| Safari | 14+ | Latest |
| Edge | 90+ | Latest |

**Requirements:**
- WebGL 2.0 support
- JavaScript enabled
- Minimum 1280x720 resolution
- 4GB RAM recommended

**Performance:**
- Target: 60 FPS
- Minimum: 30 FPS
- Tested on: Intel HD Graphics 620 or equivalent

## 🎯 Gameplay

### Overview

You wake up as **Dr. Elena Voss**, a psychologist who hasn't left her apartment in three years. By examining objects and uncovering clues, you piece together the truth about:

- Your breakthrough VR treatment for agoraphobia
- The accident that changed everything
- Your research partner Sarah
- The choice you must make at the door

### Duration
- **Speed Run**: 15 minutes (minimum objects only)
- **Normal Playthrough**: 20-30 minutes
- **Completionist**: 35+ minutes (all objects, secrets)

### Endings

The game features **two distinct endings** based on your final choice:
- **Ending A**: Face your fears
- **Ending B**: Remain in comfort

Both endings are valid and meaningful. There is no "correct" choice.

## 🔧 Troubleshooting

### Common Issues

**Game won't start / Black screen**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Performance issues / Low FPS**
- Lower resolution in settings
- Enable "Reduce Motion"
- Close other browser tabs
- Update graphics drivers
- Try a different browser

**TypeScript errors**
```bash
# Clean TypeScript cache
npm run type-check
```

**Tests failing**
```bash
# Clear Jest cache
npm test -- --clearCache
npm test
```

### Debug Mode

Enable debug mode for troubleshooting:

```typescript
// In main.ts
const DEBUG = true;

if (DEBUG) {
  // Shows FPS counter
  // Displays collision boxes
  // Logs interactions
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests first (TDD approach)
4. Implement your feature
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards

- Follow existing code style
- Write tests for new features
- Maintain 90%+ test coverage
- Document public APIs with JSDoc
- Use TypeScript strict mode
- Run linter before committing

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add new dialogue system
fix: Correct raycasting intersection bug
docs: Update README with controls
test: Add tests for StorySystem
refactor: Improve performance of object pooling
```

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Credits

### Development
- **Game Design & Story**: [Your Name]
- **Programming**: [Your Name]
- **Testing**: [Your Name]

### Technology
- **Three.js** - 3D rendering engine
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **Jest** - Testing framework

### Special Thanks
- The Three.js community
- Mental health awareness organizations
- All playtesters and contributors

## 🔗 Links

- **Documentation**: [docs/](./docs/)
- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/the-room-beyond/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/the-room-beyond/discussions)

## 📧 Contact

Have questions or feedback?

- **Email**: your.email@example.com
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- **Discord**: [Join our server](https://discord.gg/yourserver)

## 🙏 Support

If you found this project helpful or meaningful:

- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 🔀 Submit pull requests
- 📢 Share with others

---

## 🎭 Content Warning

This game deals with themes of:
- Mental health (agoraphobia, PTSD)
- Trauma and grief
- Survivor's guilt
- Death (mentioned, not shown)

The game approaches these topics with respect and offers a message of hope. If you're struggling with mental health issues, please reach out to:

- **National Suicide Prevention Lifeline**: 988 (US)
- **Crisis Text Line**: Text HOME to 741741 (US)
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

---

**Made with ❤️ and Three.js**

*"The Room Beyond was always unlocked. We just had to be ready to leave."*
