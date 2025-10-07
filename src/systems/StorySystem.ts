import { StoryEventType, EventCallback, StoryState } from '../types/interfaces';

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

  getDiscoveredObjects(): Set<string> {
    return new Set(this.discoveredObjects);
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
    if (this.currentAct === 1 && this.discoveredObjects.size >= 3 && !this.getFlag('act1_complete')) {
      this.flags.set('act1_complete', true);
      this.emit('flagChanged', { flag: 'act1_complete', value: true });
    }

    // Act 2 -> Act 3: Critical items examined
    if (this.currentAct === 2 && !this.getFlag('act2_complete')) {
      const criticalItems = [
        'laptop_accessed',
        'vr_examined',
        'photo_examined'
      ];
      const allCriticalExamined = criticalItems.every(item => 
        this.getFlag(item) === true
      );

      if (allCriticalExamined) {
        this.flags.set('act2_complete', true);
        this.emit('flagChanged', { flag: 'act2_complete', value: true });
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