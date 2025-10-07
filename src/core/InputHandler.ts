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

  onClickCallback(callback: (x: number, y: number) => void): void {
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