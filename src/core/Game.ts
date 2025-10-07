import * as THREE from 'three';
import { InputHandler } from '@core/InputHandler';
import { CameraController } from '@core/CameraController';
import { InteractionSystem } from '@systems/InteractionSystem';

export class Game {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public inputHandler: InputHandler;
  public cameraController: CameraController;
  public interactionSystem: InteractionSystem | null = null;
  
  private running: boolean = false;
  private lastTime: number = 0;
  private animationId: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 1.6, 0);

    // Initialize input handler
    this.inputHandler = new InputHandler(canvas);
    
    // Initialize camera controller
    this.cameraController = new CameraController(this.camera, this.inputHandler, canvas);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  stop(): void {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  isRunning(): boolean {
    return this.running;
  }

  private gameLoop(currentTime: number): void {
    if (!this.running) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number): void {
    // Update camera controller
    this.cameraController.update(deltaTime);
    
    // Update interaction system with proximity and focus detection
    if (this.interactionSystem) {
      const playerPosition = this.cameraController.getPosition();
      this.interactionSystem.update(deltaTime);
      this.interactionSystem.checkProximity(playerPosition);
      this.interactionSystem.updateFocus(this.camera, playerPosition);
    }
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  handleResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Getter methods
  getInputHandler(): InputHandler {
    return this.inputHandler;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  getCameraController(): CameraController {
    return this.cameraController;
  }

  setInteractionSystem(interactionSystem: InteractionSystem): void {
    this.interactionSystem = interactionSystem;
  }

  getInteractionSystem(): InteractionSystem | null {
    return this.interactionSystem;
  }

  dispose(): void {
    this.stop();
    this.cameraController.dispose();
    this.inputHandler.dispose();
    if (this.interactionSystem) {
      this.interactionSystem.dispose();
    }
    this.renderer.dispose();
    this.scene.clear();
  }
}