import * as THREE from 'three';

// Core Entity Component System interfaces
export interface Entity {
  id: string;
  components: Map<string, Component>;
}

export interface Component {
  type: string;
  update?(deltaTime: number): void;
}

// Event system interfaces
export interface EventEmitter {
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, data?: any): void;
}

// Game state enumeration
export enum GameState {
  LOADING,
  MAIN_MENU,
  PLAYING,
  PAUSED,
  DIALOGUE,
  GAME_OVER
}

// Input command pattern
export interface Command {
  execute(): void;
  undo?(): void;
}

// Scene management interface
export interface Scene {
  setup(): void;
  enter(): void;
  exit(): void;
  update(deltaTime: number): void;
  dispose(): void;
}

// Interactive object interface
export interface InteractableObject {
  id: string;
  mesh: THREE.Object3D;
  name: string;
  description: string;
  examined: boolean;
  onExamine: () => void;
  highlightOnHover: boolean;
}

// Dialogue system interfaces
export interface DialogueNode {
  id: string;
  speaker?: string;
  text: string;
  choices?: DialogueChoice[];
  next?: string;
  onComplete?: () => void;
}

export interface DialogueChoice {
  text: string;
  nextNodeId?: string;
  nextId?: string; // Allow both for backwards compatibility
  condition?: string;
}

export interface DialogueState {
  currentNodeId: string | null;
  history: string[];
  isActive: boolean;
}

export type DialogueEventType = 'dialogueStart' | 'dialogueEnd' | 'nodeChange';
export type DialogueEventCallback = (data?: any, previousData?: any) => void;

// Story system interfaces
export interface StoryFlag {
  key: string;
  value: boolean | number | string;
}

export interface StoryState {
  flags: Record<string, any>;
  discoveredObjects: string[];
  currentAct: number;
}

// Save system interface
export interface SaveData {
  version: string;
  timestamp: number;
  playerPosition: { x: number; y: number; z: number };
  cameraRotation: { x: number; y: number };
  storyFlags: Record<string, any>;
  discoveredObjects: string[];
  currentAct: number;
  playtime: number;
}

// Audio system interfaces
export interface AudioConfig {
  volume: number;
  loop: boolean;
  fadeIn?: number;
  fadeOut?: number;
}

// Accessibility interfaces
export interface AccessibilitySettings {
  textSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reduceMotion: boolean;
  subtitles: boolean;
  screenReaderMode: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

// Discovery progress tracking
export interface DiscoveryProgress {
  totalObjects: 20;
  examined: number;
  deeplyExamined: number;
  memoryTriggersFound: number;
  currentAct: 1 | 2 | 3;
  canProgressToAct2: boolean;
  canProgressToAct3: boolean;
  doorUnlocked: boolean;
}

// Story event types
export type StoryEventType = 'flagChanged' | 'objectDiscovered' | 'actChanged';
export type EventCallback = (data: any) => void;