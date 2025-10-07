# Art Direction - The Room Beyond

## Visual Philosophy

### Core Concept
**"Believable Simplicity"** - Create a realistic environment using only Three.js procedural primitives. Every object should be recognizable despite geometric simplicity.

### Design Principles
1. **Form Follows Function** - Object shape clearly communicates purpose
2. **Restrained Palette** - Limited, realistic colors
3. **Meaningful Detail** - Every element serves the story
4. **Emotional Lighting** - Mood driven by light, not complexity
5. **Geometric Honesty** - Embrace primitive shapes, don't hide them

## Color Palette

### Primary Colors (Room)
```
Walls:      #D4C5B9  (Warm beige)
Floor:      #8B7355  (Dark wood)
Ceiling:    #E8E8E8  (Off-white)
Trim:       #A0826D  (Medium wood)
```

### Accent Colors (Objects)
```
Technology:  #1C1C1E  (Deep charcoal)
Screens:     #0A84FF  (Bright blue - active)
             #2C3E50  (Dark blue-gray - inactive)
Papers:      #F5F5DC  (Cream/beige)
Fabric:      #4A5568  (Slate gray - bedding)
             #7C3AED  (Purple accent - pillow)
Glass:       #B8D4E8  (Light blue - transparent)
Metal:       #8B8B8B  (Neutral gray)
```

### Lighting Colors
```
Morning Sun:     #FFE4B5  (Warm amber)
Ambient:         #404040  (Neutral gray)
Lamp:            #FFAA33  (Warm yellow)
Screen Glow:     #0A84FF  (Cool blue)
```

### Emotional Progression
```
Act 1 (Calm):    Warm tones, soft shadows
Act 2 (Tense):   Cooler tones, harder shadows
Act 3 (Clarity): Neutral tones, even lighting
```

## Material System

### Material Types

#### 1. Matte (Most Objects)
```typescript
new THREE.MeshStandardMaterial({
  color: 0xCOLOR,
  roughness: 0.8,
  metalness: 0.0
})
```
**Used for:** Walls, furniture, fabric, paper

#### 2. Glossy (Reflective Surfaces)
```typescript
new THREE.MeshStandardMaterial({
  color: 0xCOLOR,
  roughness: 0.3,
  metalness: 0.6
})
```
**Used for:** Phone, laptop, metal objects

#### 3. Transparent (Glass/Screens)
```typescript
new THREE.MeshPhysicalMaterial({
  color: 0xCOLOR,
  transparent: true,
  opacity: 0.3,
  roughness: 0.1,
  metalness: 0.0
})
```
**Used for:** Window glass, VR lenses, water glass

#### 4. Emissive (Light Sources)
```typescript
new THREE.MeshStandardMaterial({
  color: 0xCOLOR,
  emissive: 0xCOLOR,
  emissiveIntensity: 0.5
})
```
**Used for:** Clock display, phone screen, lamp bulb

## Room Layout & Dimensions

### Space Specifications
```
Room Size:  10m x 10m x 3m (W x D x H)
Origin:     Center of room floor (0, 0, 0)

Coordinates:
  North Wall:  z = -5
  South Wall:  z = +5 (door)
  West Wall:   x = -5
  East Wall:   x = +5 (window)
  Floor:       y = 0
  Ceiling:     y = 3
```

### Zones
```
┌─────────────────────────────────┐
│  BOOKSHELF    │    WINDOW       │
│               │                 │
│   DESK        │      BED        │
│   AREA        │      AREA       │
│   VR          │                 │
│               │    NIGHTSTAND   │
│               │                 │
│   MIRROR      │    DRESSER      │
│               │                 │
└───────────[DOOR]────────────────┘

Legend:
• Desk Area: x[-4,-2], z[-4,-2]
• Bed Area: x[1,4], z[-4,-1]
• Door: x[0], z[5]
• Window: x[5], z[0]
```

## Object Design Specifications

### Furniture

#### Bed (Queen Size)
```typescript
// Frame
Dimensions: 2.0m (W) x 2.2m (L) x 0.5m (H)
Geometry: BoxGeometry
Material: Dark wood (roughness: 0.7)
Position: (2.5, 0.25, -2.5)

// Mattress
Dimensions: 1.9m x 2.1m x 0.2m
Geometry: BoxGeometry
Material: Fabric gray (roughness: 0.9)
Position: (2.5, 0.6, -2.5)

// Pillow (x2)
Dimensions: 0.5m x 0.3m x 0.15m
Geometry: BoxGeometry with rounded edges
Material: White fabric (roughness: 0.85)
Positions: (2.5, 0.775, -3.2), (2.5, 0.775, -3.5)

// Blanket (rumpled)
Dimensions: 1.8m x 2.0m x 0.1m
Geometry: Multiple boxes at angles
Material: Slate gray (roughness: 0.9)
Position: Partially covering mattress
```

#### Desk
```typescript
// Desktop
Dimensions: 1.5m (W) x 0.8m (D) x 0.02m (H)
Geometry: BoxGeometry
Material: Wood (roughness: 0.6)
Position: (-3, 0.73, -3)

// Legs (x4)
Dimensions: 0.05m x 0.05m x 0.73m
Geometry: BoxGeometry
Material: Wood (roughness: 0.6)
Positions: Corner offsets from desktop
```

#### Nightstand
```typescript
// Body
Dimensions: 0.5m x 0.4m x 0.5m
Geometry: BoxGeometry
Material: Wood (roughness: 0.7)
Position: (3.8, 0.25, -1)

// Drawer front
Dimensions: 0.45m x 0.35m x 0.02m
Geometry: BoxGeometry
Material: Wood darker (roughness: 0.7)
Position: Front face of body

// Handle
Dimensions: 0.15m x 0.02m x 0.02m
Geometry: CylinderGeometry
Material: Metal (roughness: 0.3, metalness: 0.7)
Position: Center of drawer
```

### Technology Objects

#### Smartphone
```typescript
// Body
Dimensions: 0.08m x 0.15m x 0.01m
Geometry: BoxGeometry
Material: Black plastic (roughness: 0.4, metalness: 0.6)
Position: (3.7, 0.52, -1)

// Screen
Dimensions: 0.07m x 0.13m x 0.001m
Geometry: PlaneGeometry
Material: Emissive blue (emissiveIntensity: 0.3)
Position: 0.006m offset from body surface

// Camera lens (top)
Dimensions: 0.01m radius
Geometry: CircleGeometry
Material: Glass (transparent, opacity: 0.5)
Position: Top corner of body
```

#### Laptop
```typescript
// Base
Dimensions: 0.35m x 0.25m x 0.02m
Geometry: BoxGeometry
Material: Aluminum (roughness: 0.3, metalness: 0.8)
Position: (-2.8, 0.75, -3)

// Screen
Dimensions: 0.33m x 0.20m x 0.01m
Geometry: BoxGeometry
Material: Black (roughness: 0.4, metalness: 0.6)
Position: Hinged from base, 110° angle
Rotation: (-20° on X-axis)

// Display
Dimensions: 0.31m x 0.18m
Geometry: PlaneGeometry
Material: Emissive dark blue (emissiveIntensity: 0.2)
Position: Centered on screen

// Keyboard
Dimensions: 0.30m x 0.12m x 0.005m
Geometry: BoxGeometry with key details
Material: Black keys (roughness: 0.6)
Position: On base surface
```

#### VR Headset
```typescript
// Main body
Dimensions: 0.20m x 0.15m x 0.12m
Geometry: BoxGeometry with rounded edges
Material: White plastic (roughness: 0.5)
Position: (-2.5, 0.76, -3.2)

// Lenses (x2)
Dimensions: 0.05m diameter
Geometry: CircleGeometry
Material: Glass with slight blue tint (transparent)
Position: Front face, spaced for eyes

// Head strap
Dimensions: 0.02m x 0.30m
Geometry: TorusGeometry partial
Material: Black elastic (roughness: 0.8)
Position: Attached to sides

// LED indicator
Dimensions: 0.01m diameter
Geometry: CircleGeometry
Material: Emissive green (when on) or red (when off)
Position: Top center of body
```

#### Alarm Clock (Digital)
```typescript
// Body
Dimensions: 0.20m x 0.12m x 0.08m
Geometry: BoxGeometry rounded
Material: Dark plastic (roughness: 0.7)
Position: (3.6, 0.52, -0.8)

// Display
Dimensions: 0.15m x 0.05m
Geometry: PlaneGeometry
Material: Emissive green (#00FF00, emissiveIntensity: 0.8)
Position: Front face, slight recessed

// Time display (using text or shapes)
Content: "6:47"
Style: Seven-segment display style
Color: Bright green glow
```

### Personal Items

#### Framed Photograph
```typescript
// Frame
Dimensions: 0.15m x 0.20m x 0.02m
Geometry: BoxGeometry
Material: Dark wood (roughness: 0.6)
Position: (-2, 0.76, -3.8) on desk

// Photo surface
Dimensions: 0.13m x 0.18m
Geometry: PlaneGeometry
Material: Glossy paper with image texture
Content: Abstract representation of two figures
  - Silhouettes or simple shapes
  - Warm color palette
  - Lab coats suggestion (white shapes)
```

#### Books (Stack)
```typescript
// Individual book
Dimensions: 0.15m x 0.22m x 0.03m (each)
Geometry: BoxGeometry
Material: Various colors (academic palette)
  - Burgundy, navy, forest green
  - Roughness: 0.8
Position: (3.6, 0.52, -1.2) stacked

// Spine details
Elements: Thin colored rectangles for titles
Colors: Gold, white for text representation
```

#### Medicine Bottles (x3)
```typescript
// Bottle body
Dimensions: 0.03m diameter x 0.08m height
Geometry: CylinderGeometry
Material: Amber translucent plastic
  - Orange tint (#FFA500)
  - Opacity: 0.7
  - Roughness: 0.5
Position: (3.5, 0.52, -0.9) clustered

// Cap
Dimensions: 0.035m diameter x 0.02m height
Geometry: CylinderGeometry
Material: White plastic (roughness: 0.6)

// Label
Dimensions: Wraps around bottle
Geometry: Curved plane or white band
Material: White paper (roughness: 0.9)
```

#### Coffee Mug
```typescript
// Body
Dimensions: 0.08m diameter x 0.10m height
Geometry: CylinderGeometry
Material: Ceramic white (roughness: 0.4)
Position: (-3.2, 0.76, -2.7)

// Handle
Dimensions: Torus partial (120°)
Geometry: TorusGeometry
Material: Same as body
Position: Attached to side

// Coffee (old)
Dimensions: 0.075m diameter x 0.06m height
Geometry: CylinderGeometry
Material: Dark brown (#3E2723, roughness: 0.3)
Position: Inside mug
```

### Room Elements

#### Window
```typescript
// Frame
Dimensions: 1.5m x 2.0m x 0.1m
Geometry: BoxGeometry (hollow rectangle)
Material: White painted wood (roughness: 0.7)
Position: (5, 1.5, 0) in wall

// Glass pane
Dimensions: 1.4m x 1.9m x 0.02m
Geometry: PlaneGeometry
Material: Glass (transparent, opacity: 0.3, slight blue tint)
Position: Center of frame

// View outside (skybox)
Background: Gradient from light blue to white
Elements: Simplified building silhouettes (dark shapes)
  - No detail, just rectangular forms
  - Creates sense of city
```

#### Door
```typescript
// Door panel
Dimensions: 0.9m x 2.1m x 0.05m
Geometry: BoxGeometry
Material: White painted wood (roughness: 0.7)
Position: (0, 1.05, 5)

// Door frame
Dimensions: 1.0m x 2.2m x 0.1m (hollow)
Geometry: BoxGeometry outline
Material: White trim (roughness: 0.7)
Position: Surrounding door

// Handle
Dimensions: 0.15m x 0.05m x 0.05m
Geometry: BoxGeometry rounded
Material: Brushed metal (roughness: 0.4, metalness: 0.8)
Position: (0.35, 1.0, 5.03) right side

// Keyhole
Dimensions: 0.015m diameter
Geometry: CircleGeometry
Material: Dark metal (roughness: 0.3, metalness: 0.9)
Position: Below handle
```

#### Mirror
```typescript
// Frame
Dimensions: 0.8m x 1.2m x 0.03m
Geometry: BoxGeometry
Material: Dark wood or black (roughness: 0.5)
Position: (-5, 1.5, 2) on wall

// Reflective surface
Dimensions: 0.75m x 1.15m
Geometry: PlaneGeometry
Material: THREE.MeshStandardMaterial with envMap
  - High metalness (0.9)
  - Low roughness (0.1)
  - Reflects scene
Position: Center of frame

// Reflection handling
Method: CubeCamera or screen-space reflection
Update: Every frame or on player movement
Quality: Medium (performance balance)
```

#### Curtains
```typescript
// Curtain rod
Dimensions: 1.6m length x 0.02m diameter
Geometry: CylinderGeometry
Material: Brushed metal (roughness: 0.4, metalness: 0.7)
Position: (5, 2.5, 0) above window

// Curtain panels (x2)
Dimensions: 0.8m x 2.2m each
Geometry: PlaneGeometry with slight curve
Material: Fabric (roughness: 0.9)
  - Color: Cream (#F5F5DC)
  - Subtle wave pattern via vertex displacement
Position: Sides of window, can be "opened" or "closed"

// States
Open: Panels at edges (x = ±0.7 from center)
Closed: Panels meet in center
Transition: Smooth animation over 1 second
```

## Lighting Design

### Primary Light Sources

#### 1. Morning Sunlight
```typescript
const sunlight = new THREE.DirectionalLight(0xFFE4B5, 0.6);
sunlight.position.set(8, 5, -3);
sunlight.castShadow = true;

// Shadow settings
sunlight.shadow.mapSize.width = 2048;
sunlight.shadow.mapSize.height = 2048;
sunlight.shadow.camera.near = 0.5;
sunlight.shadow.camera.far = 20;

// Time-of-day variation
Act 1: Intensity 0.6 (morning)
Act 2: Intensity 0.4 (afternoon/overcast)
Act 3: Intensity 0.7 (clarity)
```

#### 2. Desk Lamp
```typescript
const lampLight = new THREE.PointLight(0xFFAA33, 0.8, 4);
lampLight.position.set(-2.8, 1.5, -3);
lampLight.castShadow = true;

// Lamp object
const lampShade = new THREE.Mesh(
  new THREE.ConeGeometry(0.15, 0.25, 8),
  new THREE.MeshStandardMaterial({
    color: 0x8B7355,
    roughness: 0.7,
    emissive: 0xFFAA33,
    emissiveIntensity: 0.3
  })
);
lampShade.position.set(-2.8, 1.4, -3);
```

#### 3. Ambient Light
```typescript
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

// Variation by act
Act 1: 0.4 (comfortable)
Act 2: 0.2 (tense)
Act 3: 0.5 (revealing)
```

#### 4. Screen Glow
```typescript
// Phone screen
const phoneGlow = new THREE.PointLight(0x0A84FF, 0.3, 0.5);
phoneGlow.position.set(3.7, 0.55, -1);

// Laptop screen
const laptopGlow = new THREE.PointLight(0x0A84FF, 0.4, 0.8);
laptopGlow.position.set(-2.8, 0.85, -2.95);

// VR headset indicator
const vrGlow = new THREE.PointLight(0x00FF00, 0.2, 0.3);
vrGlow.position.set(-2.5, 0.8, -3.2);
```

### Shadow Configuration
```typescript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Objects that cast shadows
- All furniture
- All interactable objects
- Player (implied presence)

// Objects that receive shadows
- Floor (primary)
- Walls
- Furniture surfaces
- Bed
```

### Mood Lighting Presets

#### Calm (Act 1)
```typescript
{
  ambient: { intensity: 0.4, color: 0x404040 },
  sunlight: { intensity: 0.6, color: 0xFFE4B5 },
  lamp: { intensity: 0.8, color: 0xFFAA33 },
  fog: null
}
```

#### Tense (Act 2)
```typescript
{
  ambient: { intensity: 0.2, color: 0x303030 },
  sunlight: { intensity: 0.3, color: 0xCCCCDD },
  lamp: { intensity: 1.0, color: 0xFFAA33 },
  fog: {
    color: 0x202020,
    near: 5,
    far: 15
  }
}
```

#### Revelation (Act 3)
```typescript
{
  ambient: { intensity: 0.5, color: 0x505050 },
  sunlight: { intensity: 0.7, color: 0xFFFFFF },
  lamp: { intensity: 0.6, color: 0xFFAA33 },
  fog: null
}
```

## Visual Effects

### Hover Effect (Interactable Objects)
```typescript
// On mouse over
object.material.emissive = new THREE.Color(0x333333);
object.material.emissiveIntensity = 0.2;

// Outline shader (optional)
outlineMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  side: THREE.BackSide
});
outline = object.clone();
outline.material = outlineMaterial;
outline.scale.multiplyScalar(1.05);
```

### Examination Effect
```typescript
// Object enlarges and rotates
- Smooth camera zoom (FOV change or position)
- Object centers in view
- Can rotate with mouse drag
- Background blurs (DoF effect)
- UI overlay appears
```

### Flashback Visual Effect
```typescript
// Screen transition
- Desaturation over 0.5s
- Vignette effect (dark edges)
- Slight blur
- Color tint: sepia or blue
- Audio becomes muffled
```

### Anxiety Visual (Approaching Door)
```typescript
// Progressive distortion
Distance < 3m: 
  - Subtle vignette
  - Increased heartbeat audio
  
Distance < 2m:
  - Heavy vignette
  - Chromatic aberration
  - Camera shake (subtle)
  
Distance < 1m:
  - Strong vignette
  - Breathing audio prominent
  - Camera movement restricted
  - "Too close" feeling
```

## Camera Specifications

### Player Camera
```typescript
const camera = new THREE.PerspectiveCamera(
  75,  // FOV
  window.innerWidth / window.innerHeight,  // Aspect
  0.1,  // Near
  100   // Far
);

// Position (player height)
camera.position.set(0, 1.6, 0);  // Eye level ~5'3"

// Look controls
minPolarAngle: Math.PI * 0.1,  // Can't look too far up
maxPolarAngle: Math.PI * 0.9,  // Can't look too far down
enablePan: false,
enableZoom: false
```

### Special Camera States

#### Examining Object
```typescript
// Zoom to object
targetFOV: 50,  // Narrower FOV
targetPosition: objectPosition + offset,
transition: 0.5s ease-in-out
```

#### Flashback
```typescript
// Cinematic feel
targetFOV: 60,
vignette: true,
colorGrading: sepia or desaturated
```

## UI Visual Design

### Font Stack
```css
font-family: 
  'Segoe UI', 
  'Roboto', 
  'Helvetica Neue', 
  Arial, 
  sans-serif;
```

### UI Color Scheme
```css
--background: rgba(0, 0, 0, 0.85);
--text-primary: #FFFFFF;
--text-secondary: #CCCCCC;
--accent: #0A84FF;
--danger: #FF3B30;
--success: #34C759;
--border: rgba(255, 255, 255, 0.2);
```

### UI Components

#### Dialogue Box
```css
.dialogue {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 800px;
  background: rgba(0, 0, 0, 0.85);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 20px 30px;
  font-size: 18px;
  line-height: 1.6;
  color: #FFFFFF;
  backdrop-filter: blur(10px);
}
```

#### Interaction Prompt
```css
.interaction-prompt {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  color: #FFFFFF;
  pointer-events: none;
}
```

#### Examination UI
```css
.examination-panel {
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  width: 350px;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(15px);
}
```

## Performance Optimization

### Geometry Reuse
```typescript
// Create geometry library
const geometries = {
  box: new THREE.BoxGeometry(1, 1, 1),
  sphere: new THREE.SphereGeometry(1, 16, 16),
  cylinder: new THREE.CylinderGeometry(1, 1, 1, 16),
  plane: new THREE.PlaneGeometry(1, 1)
};

// Reuse with scale
const book = new THREE.Mesh(
  geometries.box,
  bookMaterial
);
book.scale.set(0.15, 0.02, 0.22);
```

### Material Reuse
```typescript
// Create material library
const materials = {
  wood: new THREE.MeshStandardMaterial({
    color: 0x8B7355,
    roughness: 0.7
  }),
  metal: new THREE.MeshStandardMaterial({
    color: 0x8B8B8B,
    roughness: 0.3,
    metalness: 0.8
  }),
  // ... etc
};
```

### Draw Call Optimization
```typescript
// Merge static geometry
const mergeGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([
  wall1.geometry,
  wall2.geometry,
  // ... all static walls
]);

const mergedWalls = new THREE.Mesh(mergeGeometry, wallMaterial);
```

## Accessibility Considerations

### High Contrast Mode
```typescript
highContrastColors = {
  walls: 0xFFFFFF,
  floor: 0x000000,
  objects: 0xFFFF00,
  interactable: 0x00FFFF
};
```

### Colorblind Modes
```typescript
// Protanopia (red-blind)
protanopiaFilter = adjustColors({
  red: reduceSaturation(0.6),
  compensate: increaseBlueGreen
});

// Deuteranopia (green-blind)
// Tritanopia (blue-blind)
// Similar adjustments
```

### Reduce Motion
```typescript
if (settings.reduceMotion) {
  // Disable camera shake
  // Reduce flashback effects
  // Instant transitions instead of animated
  // No background animation
}
```

---

## Visual Style Summary

**The Room Beyond** uses geometric primitives to create a believable, intimate space. The art direction prioritizes:

1. **Clarity** - Objects are immediately recognizable
2. **Atmosphere** - Lighting conveys mood and emotion
3. **Performance** - Optimized for smooth 60 FPS
4. **Cohesion** - Unified aesthetic despite simplicity
5. **Story Service** - Every visual choice supports narrative

The result is a game that proves visual complexity isn't necessary for emotional impact—sometimes, simplicity resonates deeper.

**Status:** Complete and ready for implementation
