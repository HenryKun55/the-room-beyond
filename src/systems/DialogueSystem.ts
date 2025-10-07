import { DialogueNode, DialogueChoice, DialogueState, DialogueEventType, DialogueEventCallback } from '../types/interfaces';

export class DialogueSystem {
  private nodes: Map<string, DialogueNode> = new Map();
  private currentNodeId: string | null = null;
  private history: string[] = [];
  private isActiveFlag: boolean = false;
  private eventListeners: Map<DialogueEventType, DialogueEventCallback[]> = new Map();
  private flagChecker: ((flag: string) => boolean) | null = null;

  constructor() {
    // Initialize event listeners
    this.eventListeners.set('dialogueStart', []);
    this.eventListeners.set('dialogueEnd', []);
    this.eventListeners.set('nodeChange', []);
  }

  // Node Management
  addNode(node: DialogueNode): void {
    this.nodes.set(node.id, node);
  }

  getNode(id: string): DialogueNode | null {
    return this.nodes.get(id) || null;
  }

  removeNode(id: string): void {
    this.nodes.delete(id);
  }

  // Dialogue Flow Control
  startDialogue(nodeId: string): void {
    const node = this.getNode(nodeId);
    if (!node) {
      console.warn(`Cannot start dialogue: node '${nodeId}' not found`);
      return;
    }

    this.currentNodeId = nodeId;
    this.isActiveFlag = true;
    this.addToHistory(nodeId);
    this.emit('dialogueStart', node);
  }

  endDialogue(): void {
    if (!this.isActiveFlag) return;

    this.isActiveFlag = false;
    this.currentNodeId = null;
    this.emit('dialogueEnd');
  }

  selectChoice(choiceIndex: number): void {
    const currentNode = this.getCurrentNode();
    if (!currentNode || !currentNode.choices) return;

    const availableChoices = this.getAvailableChoices();
    if (choiceIndex < 0 || choiceIndex >= availableChoices.length) {
      console.warn(`Invalid choice index: ${choiceIndex}`);
      return;
    }

    const choice = availableChoices[choiceIndex];
    const nextNode = this.getNode(choice.nextNodeId);
    
    if (nextNode) {
      const previousNode = currentNode;
      this.currentNodeId = choice.nextNodeId;
      this.addToHistory(choice.nextNodeId);
      this.emit('nodeChange', nextNode, previousNode);
    }
  }

  // State Queries
  isActive(): boolean {
    return this.isActiveFlag;
  }

  getCurrentNode(): DialogueNode | null {
    if (!this.currentNodeId) return null;
    return this.getNode(this.currentNodeId);
  }

  getAvailableChoices(): DialogueChoice[] {
    const currentNode = this.getCurrentNode();
    if (!currentNode || !currentNode.choices) return [];

    return currentNode.choices.filter(choice => this.evaluateCondition(choice.condition));
  }

  // History Management
  getHistory(): string[] {
    return [...this.history];
  }

  hasVisited(nodeId: string): boolean {
    return this.history.includes(nodeId);
  }

  clearHistory(): void {
    this.history = [];
  }

  private addToHistory(nodeId: string): void {
    if (!this.history.includes(nodeId)) {
      this.history.push(nodeId);
    }
  }

  // Conditional Logic
  setFlagChecker(checker: (flag: string) => boolean): void {
    this.flagChecker = checker;
  }

  private evaluateCondition(condition?: string): boolean {
    if (!condition) return true;

    // Handle visited node conditions (e.g., "visited:node_id")
    if (condition.startsWith('visited:')) {
      const nodeId = condition.substring(8);
      return this.hasVisited(nodeId);
    }

    // Handle flag conditions
    if (this.flagChecker) {
      return this.flagChecker(condition);
    }

    // Default to false if no flag checker is set
    return false;
  }

  // Event System
  onDialogueStart(callback: DialogueEventCallback): void {
    this.addEventListener('dialogueStart', callback);
  }

  onDialogueEnd(callback: DialogueEventCallback): void {
    this.addEventListener('dialogueEnd', callback);
  }

  onNodeChange(callback: DialogueEventCallback): void {
    this.addEventListener('nodeChange', callback);
  }

  private addEventListener(event: DialogueEventType, callback: DialogueEventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.push(callback);
    }
  }

  removeListener(event: DialogueEventType, callback: DialogueEventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: DialogueEventType, data?: any, previousData?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        if (previousData !== undefined) {
          callback(data, previousData);
        } else {
          callback(data);
        }
      });
    }
  }

  // State Persistence
  exportState(): DialogueState {
    return {
      currentNodeId: this.currentNodeId,
      history: [...this.history],
      isActive: this.isActiveFlag
    };
  }

  importState(state: DialogueState): void {
    this.currentNodeId = state.currentNodeId;
    this.history = [...state.history];
    this.isActiveFlag = state.isActive;
  }

  // Utility Methods
  getAllNodes(): DialogueNode[] {
    return Array.from(this.nodes.values());
  }

  getNodeCount(): number {
    return this.nodes.size;
  }

  dispose(): void {
    this.endDialogue();
    this.nodes.clear();
    this.clearHistory();
    this.eventListeners.clear();
    this.flagChecker = null;
  }
}