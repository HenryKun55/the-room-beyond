/**
 * DialogueModal - Isolated modal system for displaying dialogue descriptions
 * Provides pause functionality and center-screen modal display
 */

interface GameInstance {
  pause(): void;
  unpause(): void;
  isPaused(): boolean;
}

export class DialogueModal {
  private game: GameInstance;
  private visible: boolean = false;
  private currentEventHandler: ((event: KeyboardEvent) => void) | null = null;
  private overlay: HTMLElement | null = null;
  private modal: HTMLElement | null = null;

  constructor(game: GameInstance) {
    this.game = game;
  }

  /**
   * Display the modal with object name and description
   * @param objectName - Name of the object
   * @param description - Description text to display
   */
  show(objectName: string, description: string): void {
    if (!this.game) return;

    try {
      // Pause the game
      this.game.pause();

      // Create or get overlay
      this.overlay = this.getOrCreateOverlay();
      
      // Create or get modal
      this.modal = this.getOrCreateModal();
      
      // Update content
      this.updateModalContent(objectName, description);
      
      // Show elements
      this.overlay.style.display = 'block';
      this.modal.style.display = 'block';
      
      // Set up event listener
      this.setupEventListener();
      
      this.visible = true;
    } catch (error) {
      // Handle DOM errors gracefully
      console.warn('DialogueModal: Error showing modal', error);
    }
  }

  /**
   * Hide the modal and unpause the game
   */
  hide(): void {
    try {
      if (this.overlay) {
        this.overlay.style.display = 'none';
      }
      if (this.modal) {
        this.modal.style.display = 'none';
      }
      
      // Remove event listener
      this.removeEventListener();
      
      // Unpause the game
      if (this.game) {
        this.game.unpause();
      }
      
      this.visible = false;
    } catch (error) {
      console.warn('DialogueModal: Error hiding modal', error);
    }
  }

  /**
   * Check if modal is currently visible
   */
  isVisible(): boolean {
    return this.visible;
  }

  /**
   * Get the game instance (for testing)
   */
  getGame(): GameInstance {
    return this.game;
  }

  /**
   * Clean up resources and event listeners
   */
  dispose(): void {
    this.hide();
    this.removeEventListener();
  }

  private getOrCreateOverlay(): HTMLElement {
    let overlay = document.getElementById('dialogue-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'dialogue-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(3px);
        z-index: 10000;
        display: none;
      `;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  private getOrCreateModal(): HTMLElement {
    let modal = document.getElementById('dialogue-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dialogue-modal';
      modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 80vw;
        max-height: 80vh;
        min-width: 400px;
        background: #1a1a1a;
        color: #00ff88;
        border: 3px solid #00ff88;
        border-radius: 12px;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        line-height: 1.6;
        z-index: 10001;
        display: none;
        box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
      `;
      
      // Add to overlay or body
      if (this.overlay) {
        this.overlay.appendChild(modal);
      } else {
        document.body.appendChild(modal);
      }
    }
    return modal;
  }

  private updateModalContent(objectName: string, description: string): void {
    if (!this.modal) return;

    // Create content container
    const content = document.createElement('div');
    content.style.cssText = `
      padding: 30px;
      overflow-y: auto;
      max-height: calc(80vh - 80px);
      scrollbar-width: thin;
      scrollbar-color: #00ff88 #2a2a2a;
    `;

    // Add custom scrollbar styles
    this.addScrollbarStyles();

    content.innerHTML = `
      <div style="margin-bottom: 20px; color: #fff; font-weight: bold; font-size: 20px; text-align: center; border-bottom: 2px solid #00ff88; padding-bottom: 15px;">
        ${objectName}
      </div>
      <div style="margin-bottom: 25px; text-align: justify;">
        ${description}
      </div>
      <div style="text-align: center; color: #888; font-size: 14px; border-top: 1px solid #444; padding-top: 15px;">
        Press <span style="color: #00ff88; font-weight: bold;">SPACE</span> to close
      </div>
    `;

    // Clear and add new content
    this.modal.innerHTML = '';
    this.modal.appendChild(content);
  }

  private addScrollbarStyles(): void {
    if (document.getElementById('dialogue-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'dialogue-modal-styles';
    style.textContent = `
      #dialogue-modal ::-webkit-scrollbar {
        width: 12px;
      }
      #dialogue-modal ::-webkit-scrollbar-track {
        background: #2a2a2a;
        border-radius: 6px;
      }
      #dialogue-modal ::-webkit-scrollbar-thumb {
        background: #00ff88;
        border-radius: 6px;
        border: 2px solid #2a2a2a;
      }
      #dialogue-modal ::-webkit-scrollbar-thumb:hover {
        background: #00cc6a;
      }
    `;
    document.head.appendChild(style);
  }

  private setupEventListener(): void {
    // Remove existing listener
    this.removeEventListener();

    // Create new event handler
    this.currentEventHandler = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        this.hide();
      }
    };

    document.addEventListener('keydown', this.currentEventHandler);
  }

  private removeEventListener(): void {
    if (this.currentEventHandler) {
      document.removeEventListener('keydown', this.currentEventHandler);
      this.currentEventHandler = null;
    }
  }
}