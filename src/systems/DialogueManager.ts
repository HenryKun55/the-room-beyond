import { DialogueSystem } from './DialogueSystem';
import { DialogueContent } from '../content/DialogueContent';
import { DialogueNode } from '../types/interfaces';

/**
 * DialogueManager integrates the DialogueSystem with the game's interaction system
 * Manages object-specific dialogue trees and provides a unified interface
 */
export class DialogueManager {
  private dialogueSystem: DialogueSystem;
  private objectDialogues: Map<string, Map<string, DialogueNode>>;
  private currentObjectId: string | null = null;
  
  // UI Elements for dialogue display
  private dialogueContainer: HTMLElement | null = null;
  private dialogueText: HTMLElement | null = null;
  private choicesContainer: HTMLElement | null = null;
  
  constructor() {
    this.dialogueSystem = new DialogueSystem();
    this.objectDialogues = DialogueContent.getAllDialogue();
    this.createDialogueUI();
    this.setupEventListeners();
  }
  
  /**
   * Start dialogue for a specific object
   */
  startObjectDialogue(objectId: string): boolean {
    const objectDialogue = this.objectDialogues.get(objectId);
    if (!objectDialogue) {
      console.warn(`No dialogue found for object: ${objectId}`);
      return false;
    }
    
    // Clear existing dialogue and load new one
    this.dialogueSystem.clearNodes();
    
    // Add all nodes for this object
    objectDialogue.forEach((node, nodeId) => {
      this.dialogueSystem.addNode(node);
    });
    
    // Start with the object's starting node
    const startNodeId = `${objectId}_start`;
    this.currentObjectId = objectId;
    this.dialogueSystem.startDialogue(startNodeId);
    
    this.showDialogueUI();
    this.updateDialogueDisplay();
    
    return true;
  }
  
  /**
   * Handle choice selection
   */
  selectChoice(choiceIndex: number): void {
    this.dialogueSystem.selectChoice(choiceIndex);
    this.updateDialogueDisplay();
    
    // If dialogue ended, hide UI after a brief delay
    if (!this.dialogueSystem.isActive()) {
      setTimeout(() => {
        this.hideDialogueUI();
      }, 1000);
    }
  }
  
  /**
   * Create the dialogue UI elements
   */
  private createDialogueUI(): void {
    // Create dialogue container
    this.dialogueContainer = document.createElement('div');
    this.dialogueContainer.id = 'dialogue-container';
    this.dialogueContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 800px;
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #00ff88;
      border-radius: 10px;
      padding: 20px;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      line-height: 1.6;
      z-index: 1000;
      display: none;
      box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
    `;
    
    // Create dialogue text area
    this.dialogueText = document.createElement('div');
    this.dialogueText.id = 'dialogue-text';
    this.dialogueText.style.cssText = `
      margin-bottom: 20px;
      min-height: 60px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 5px;
    `;
    
    // Create choices container
    this.choicesContainer = document.createElement('div');
    this.choicesContainer.id = 'choices-container';
    this.choicesContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    
    // Assemble the UI
    this.dialogueContainer.appendChild(this.dialogueText);
    this.dialogueContainer.appendChild(this.choicesContainer);
    document.body.appendChild(this.dialogueContainer);
  }
  
  /**
   * Update the dialogue display with current content
   */
  private updateDialogueDisplay(): void {
    if (!this.dialogueText || !this.choicesContainer) return;
    
    const currentNode = this.dialogueSystem.getCurrentNode();
    if (!currentNode) {
      this.hideDialogueUI();
      return;
    }
    
    // Update dialogue text with typewriter effect
    this.typewriterText(currentNode.text);
    
    // Update choices
    this.updateChoicesDisplay();
  }
  
  /**
   * Create typewriter effect for dialogue text
   */
  private typewriterText(text: string): void {
    if (!this.dialogueText) return;
    
    this.dialogueText.textContent = '';
    let index = 0;
    
    const typeSpeed = 30; // milliseconds per character
    
    const typeNextChar = () => {
      if (index < text.length && this.dialogueText) {
        this.dialogueText.textContent += text[index];
        index++;
        setTimeout(typeNextChar, typeSpeed);
      } else {
        // Text is complete, show choices
        setTimeout(() => this.updateChoicesDisplay(), 500);
      }
    };
    
    typeNextChar();
  }
  
  /**
   * Update the choices display
   */
  private updateChoicesDisplay(): void {
    if (!this.choicesContainer) return;
    
    // Clear existing choices
    this.choicesContainer.innerHTML = '';
    
    const choices = this.dialogueSystem.getAvailableChoices();
    
    if (choices.length === 0) {
      // No choices means end of dialogue - show continue prompt
      const continueBtn = document.createElement('button');
      continueBtn.textContent = 'Press E to continue...';
      continueBtn.style.cssText = `
        padding: 10px 20px;
        background: rgba(0, 255, 136, 0.2);
        border: 1px solid #00ff88;
        color: #00ff88;
        border-radius: 5px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
      `;
      
      continueBtn.addEventListener('click', () => this.hideDialogueUI());
      if (this.choicesContainer) {
        this.choicesContainer.appendChild(continueBtn);
      }
      
      // Also allow E key to close
      this.setupCloseOnE();
      
      return;
    }
    
    // Create choice buttons
    choices.forEach((choice, index) => {
      const choiceBtn = document.createElement('button');
      choiceBtn.textContent = `${index + 1}. ${choice.text}`;
      choiceBtn.style.cssText = `
        padding: 12px 15px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #666;
        color: #ffffff;
        border-radius: 5px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        text-align: left;
        cursor: pointer;
        transition: all 0.3s ease;
      `;
      
      choiceBtn.addEventListener('mouseenter', () => {
        choiceBtn.style.background = 'rgba(0, 255, 136, 0.2)';
        choiceBtn.style.borderColor = '#00ff88';
      });
      
      choiceBtn.addEventListener('mouseleave', () => {
        choiceBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        choiceBtn.style.borderColor = '#666';
      });
      
      choiceBtn.addEventListener('click', () => {
        this.selectChoice(index);
      });
      
      if (this.choicesContainer) {
        this.choicesContainer.appendChild(choiceBtn);
      }
    });
    
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
  }
  
  /**
   * Setup keyboard navigation for choices
   */
  private setupKeyboardNavigation(): void {
    const keyHandler = (event: KeyboardEvent) => {
      const choices = this.dialogueSystem.getAvailableChoices();
      const key = event.key;
      
      // Number keys 1-9 for choice selection
      if (key >= '1' && key <= '9') {
        const choiceIndex = parseInt(key) - 1;
        if (choiceIndex < choices.length) {
          this.selectChoice(choiceIndex);
          document.removeEventListener('keydown', keyHandler);
        }
      }
      
      // ESC to close dialogue
      if (key === 'Escape') {
        this.hideDialogueUI();
        document.removeEventListener('keydown', keyHandler);
      }
    };
    
    document.addEventListener('keydown', keyHandler);
  }
  
  /**
   * Setup E key to close dialogue when no choices available
   */
  private setupCloseOnE(): void {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'e') {
        this.hideDialogueUI();
        document.removeEventListener('keydown', keyHandler);
      }
    };
    
    document.addEventListener('keydown', keyHandler);
  }
  
  /**
   * Show the dialogue UI
   */
  private showDialogueUI(): void {
    if (this.dialogueContainer) {
      this.dialogueContainer.style.display = 'block';
      
      // Animate in
      this.dialogueContainer.style.opacity = '0';
      this.dialogueContainer.style.transform = 'translateX(-50%) translateY(20px)';
      
      setTimeout(() => {
        if (this.dialogueContainer) {
          this.dialogueContainer.style.transition = 'all 0.3s ease';
          this.dialogueContainer.style.opacity = '1';
          this.dialogueContainer.style.transform = 'translateX(-50%) translateY(0)';
        }
      }, 10);
    }
  }
  
  /**
   * Hide the dialogue UI
   */
  private hideDialogueUI(): void {
    if (this.dialogueContainer) {
      this.dialogueContainer.style.transition = 'all 0.3s ease';
      this.dialogueContainer.style.opacity = '0';
      this.dialogueContainer.style.transform = 'translateX(-50%) translateY(20px)';
      
      setTimeout(() => {
        if (this.dialogueContainer) {
          this.dialogueContainer.style.display = 'none';
        }
      }, 300);
    }
    
    this.currentObjectId = null;
    this.dialogueSystem.endDialogue();
  }
  
  /**
   * Setup event listeners for dialogue events
   */
  private setupEventListeners(): void {
    // DialogueSystem doesn't have event emitters yet
    // This will be implemented later if needed
    console.log('DialogueManager initialized');
  }
  
  /**
   * Check if dialogue is currently active
   */
  isActive(): boolean {
    return this.dialogueSystem.isActive();
  }
  
  /**
   * Get the current object being examined
   */
  getCurrentObjectId(): string | null {
    return this.currentObjectId;
  }
  
  /**
   * Dispose of the dialogue manager
   */
  dispose(): void {
    if (this.dialogueContainer) {
      document.body.removeChild(this.dialogueContainer);
    }
    
    this.dialogueSystem.dispose();
  }
}