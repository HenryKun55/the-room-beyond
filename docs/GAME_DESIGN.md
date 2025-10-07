# Game Design Document - The Room Beyond

## Game Overview

### High Concept
A first-person psychological mystery where you play as Dr. Elena Voss, a psychologist with severe agoraphobia, who must unravel the truth about her breakthrough treatment by exploring the only space she can access—her own room.

### Core Pillars
1. **Environmental Storytelling** - Every object tells part of the story
2. **Psychological Tension** - Building dread through atmosphere, not action
3. **Player Agency** - Meaningful choices that affect the ending
4. **Accessibility** - Mystery should be solvable by observation and deduction

## Gameplay Mechanics

### Core Loop
```
Explore Room → Examine Object → Trigger Memory/Dialogue → 
Discover Clue → Update Mental Map → Progress Story → Repeat
```

### Player Capabilities

#### Movement
- **First-person camera control**: Mouse to look around (360° horizontal, -80° to +80° vertical)
- **WASD movement**: Walk around the room at realistic pace (1.5 m/s)
- **No jumping**: Grounded, realistic movement
- **Collision detection**: Cannot walk through walls or objects

#### Interaction
- **Cursor changes**: Highlights when hovering over interactable objects
- **Click to interact**: Left click to examine objects
- **Hold to inspect**: Hold click to pick up and rotate small objects
- **Context-sensitive**: Different interactions based on story progress

#### Examination System
```
Level 1: Brief description (first glance)
Level 2: Detailed observation (closer look)
Level 3: Hidden details (after story revelation)
```

**Example: Phone**
- Level 1: "My smartphone. Several notifications."
- Level 2: "6 missed calls from Marcus. 3 voicemails. I should listen."
- Level 3: "The last call was at 2:47 AM. Was I awake? Why don't I remember?"

### Interaction Zones

#### Zone 1: Bedside Area
**Objects:**
- Bed (unmade, shows restless sleep)
- Nightstand
  - Alarm clock (time, date)
  - Medicine bottles (names visible, prescribed dates)
  - Glass of water (half-empty)
  - Book stack (psychology textbooks)
- Phone (main story device)

**Story Triggers:**
- Alarm clock → Establishes current date
- Phone → Marcus's voicemails, text messages
- Medicine → Questions about treatment
- Books → Elena's expertise area

#### Zone 2: Workspace
**Objects:**
- Desk
  - Research papers (scattered)
  - Journal (handwritten entries)
  - Pen holder
  - Coffee mug (cold, old)
- Laptop (password-protected)
- VR headset (central mystery object)
- Bookshelf (professional books)

**Story Triggers:**
- Journal → First hints about treatment
- Laptop → Video logs, research data
- VR headset → The breakthrough technology
- Papers → Research notes about agoraphobia cure

#### Zone 3: Personal Space
**Objects:**
- Mirror (player sees self)
- Dresser
- Photos (framed, on shelf)
- Window (view outside, unopenable)
- Curtains (can open/close)

**Story Triggers:**
- Mirror → Self-reflection moments
- Photos → Sarah, past life
- Window → Panic trigger, fear of outside
- Curtains → Control over exposure

#### Zone 4: The Door
**Objects:**
- Apartment door (locked? unlocked?)
- Door handle
- Key rack (keys present but unused)
- Welcome mat

**Story Triggers:**
- Door → Primary source of tension
- Attempts to approach trigger anxiety
- Final choice location
- Progressive desensitization throughout game

### Puzzle Design

#### Not Traditional Puzzles
This game features **narrative puzzles** solved through:
- **Observation**: Noticing inconsistencies
- **Deduction**: Connecting clues across objects
- **Memory**: Recalling earlier information
- **Chronology**: Understanding the timeline

#### Example: The Timeline Puzzle
**Scattered Clues:**
1. Alarm clock: "Wednesday, October 18th"
2. Journal last entry: "October 16th"
3. Phone last call: "2:47 AM, October 17th"
4. Laptop session log: "Session 847"
5. Research notes: "Only ran 23 trials"

**Deduction:**
- Missing 2 days of memory
- Session count impossibly high
- Something happened during missing time
- VR treatment affects memory

#### Example: The Sarah Mystery
**Scattered Clues:**
1. Photo: Elena + Sarah, happy, lab coats
2. Medical report: Car accident, survivor's guilt
3. Journal: "I should have chosen differently"
4. Marcus voicemail: Mentions the "incident"
5. Book dedication: "For Sarah, who believed"

**Deduction:**
- Sarah was research partner
- Died in accident Elena survived
- Elena blames herself
- Agoraphobia developed after accident
- Treatment is Elena trying to cope

### Progression System

#### Act-Based Structure
```
ACT 1: Confusion (Discovering what happened)
├─ Examine 3 objects → Memory fragment #1
├─ Examine 6 objects → Memory fragment #2
└─ Find phone → Trigger Act 2

ACT 2: Investigation (Uncovering the treatment)
├─ Access laptop → Research revealed
├─ Examine VR headset → Treatment understood
├─ Find medical reports → Sarah's death explained
└─ Trigger Act 3

ACT 3: Truth (Confronting reality)
├─ All clues available
├─ Timeline reconstructed
├─ Final memory plays
└─ Choice at door
```

#### Discovery Tracking
```typescript
interface DiscoveryProgress {
  totalObjects: 20;
  examined: number;
  deeplyExamined: number;
  memoryTriggersFound: number;
  currentAct: 1 | 2 | 3;
  canProgressToAct2: boolean;
  canProgressToAct3: boolean;
  doorUnlocked: boolean;
}
```

### Memory Flashback System

#### Trigger Conditions
Flashbacks activate when:
1. Specific objects examined in correct order
2. Player has required prior knowledge
3. Story is ready to reveal next piece

#### Flashback Presentation
```
Visual: Screen edges blur, desaturate
Audio: Muffled, distant sounds
Overlay: Memory fragment text
Duration: 15-30 seconds
Control: Auto-play, player can skip
```

#### Key Flashbacks
1. **The Accident** (Triggered by photo)
   - Car interior, Sarah laughing
   - Sudden impact
   - Elena's choice in split-second
   - Cut to black

2. **First Diagnosis** (Triggered by medical report)
   - Doctor's office
   - Elena unable to leave room
   - Diagnosis of agoraphobia
   - Marcus's concern

3. **The Breakthrough** (Triggered by research notes)
   - Lab setting
   - VR equipment
   - Elena's excitement
   - First successful trial

4. **Self-Testing** (Triggered by VR headset)
   - Elena putting on headset
   - Virtual world feels real
   - Confusion about reality
   - Waking up disoriented

5. **The Truth** (Triggered by laptop video)
   - Elena recording herself
   - Admitting door is unlocked
   - Fear is self-imposed
   - Decision to face it

### Dialogue System

#### Internal Monologue
Elena's thoughts provide:
- **Context**: What she's seeing
- **Emotion**: How she feels
- **Deduction**: Her conclusions
- **Doubt**: Questioning reality

#### Dialogue Types

**Observational:**
```
"The clock says 6:47 AM. Morning already?"
"These pills... when did I last take them?"
```

**Emotional:**
```
"I can't look at her photo without feeling it. The weight."
"Three years. Has it really been three years?"
```

**Analytical:**
```
"Session 847? That doesn't add up. Unless..."
"The treatment affects memory. My research proves it."
```

**Self-Aware:**
```
"I'm afraid to open the door. But it's not locked. It never was."
"The cage is in my mind. I built it myself."
```

#### Phone Dialogue
**Marcus (Voicemails):**
- Professional concern
- Personal worry
- Urgency about presentation
- Offer to help

**Text Messages:**
- From Marcus (recent, unanswered)
- From Unknown (cryptic, unsettling)
- Old messages from Sarah (archived)

### Decision Points

#### Micro-Decisions
Throughout the game:
- Open or close curtains (affects lighting, mood)
- Listen to voicemails now or later (affects pacing)
- Examine deeply or move on (affects understanding)
- Approach door or retreat (builds tension)

**No wrong choices** - All paths lead forward

#### The Final Choice
At the door, player must decide:

**Option A: Open the Door**
- Face fear directly
- Step into hallway
- See real world
- Positive resolution

**Option B: Walk Away**
- Return to room
- Put on VR headset
- Stay in simulation
- Ambiguous/dark ending

**Factors Influencing Choice:**
- Player's emotional connection to Elena
- Understanding of story themes
- Confidence in having full picture
- Personal risk tolerance

### UI/UX Design

#### HUD Elements
```
Minimal Interface:
┌─────────────────────────────────────┐
│                                     │
│            [Crosshair]              │  ← Interaction cursor
│                                     │
│                                     │
│  [Subtitle area]                    │  ← Bottom center
└─────────────────────────────────────┘

Optional (toggle):
- Objective hint (top left)
- Interaction prompt (center)
```

#### Cursor States
- **Default**: Small dot
- **Hovering interactable**: Hand icon
- **Can examine**: Magnifying glass
- **Cannot interact**: Red X
- **Loading**: Spinner

#### Examination UI
```
┌─────────────────────────────────────┐
│  [X Close]                          │
│                                     │
│      [3D Object Preview]            │
│      (rotate with mouse)            │
│                                     │
│  Object: Phone                      │
│  "6 missed calls from Dr. Chen..."  │
│                                     │
│  [▶ Listen to Voicemails]          │
│  [▶ Read Text Messages]            │
└─────────────────────────────────────┘
```

#### Pause Menu
```
THE ROOM BEYOND
───────────────
Resume
Settings
  ├─ Graphics
  ├─ Audio
  ├─ Accessibility
  └─ Controls
Save Game
Load Game
Main Menu
```

### Difficulty & Accessibility

#### No Traditional Difficulty
Instead, **Assist Options:**

**Navigation Assist**
- Object highlights (toggle)
- Interaction prompts always visible
- Mini-map (optional)

**Story Assist**
- Journal auto-updates with deductions
- Clue connections shown explicitly
- Timeline view available

**Pacing Options**
- Extend time for reading
- Auto-advance dialogue (toggle)
- Skip flashbacks (after first viewing)

**Visual Options**
- High contrast mode
- Larger text
- Colorblind modes
- Reduce motion effects

**Audio Options**
- Subtitles (on by default)
- Visual sound indicators
- Adjustable volumes (master, effects, dialogue)

### Replayability

#### New Game+
After completing once:
- All objects have new third-level observations
- Additional journal entries appear
- Hidden developer commentary (optional)
- Time trial mode (optional)

#### Different Playstyles
- **Speed run**: Examine only essential objects (15 min)
- **Completionist**: Find every detail (35 min)
- **Cinematic**: Experience all flashbacks fully
- **Detective**: Solve mystery before final reveal

#### Collectibles
**Optional Secrets:**
- 5 hidden journal pages
- 3 alternate flashback triggers
- 1 secret phone message
- Easter egg (developer message)

### Victory Conditions

Both endings are "victories" - player succeeds by:
1. **Completing the narrative** - Experiencing full story
2. **Understanding the themes** - Grasping psychological concepts
3. **Making informed choice** - Deciding Elena's fate knowingly

**No failure state** - Cannot "game over"

### Tone & Atmosphere

#### Emotional Progression
```
Act 1: Confusion → Curiosity
Act 2: Unease → Dread
Act 3: Understanding → Resolution
```

#### Atmospheric Elements

**Visual:**
- Warm morning light (Act 1)
- Shadows lengthen (Act 2)
- Stark clarity (Act
