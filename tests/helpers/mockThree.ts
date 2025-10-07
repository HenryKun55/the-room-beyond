// Mock Three.js for testing
export const mockWebGLRenderer = {
  domElement: {
    width: 800,
    height: 600
  },
  setSize: jest.fn((width, height) => {
    mockWebGLRenderer.domElement.width = width;
    mockWebGLRenderer.domElement.height = height;
  }),
  setPixelRatio: jest.fn(),
  render: jest.fn(),
  dispose: jest.fn(),
  shadowMap: {
    enabled: false,
    type: 'PCFSoftShadowMap'
  }
};

export const mockScene = {
  background: null,
  add: jest.fn(),
  clear: jest.fn()
};

export const mockCamera = {
  position: { x: 0, y: 1.6, z: 0, set: jest.fn() },
  aspect: 1,
  updateProjectionMatrix: jest.fn()
};

export const mockCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  return canvas;
};

// Mock Three.js modules
jest.mock('three', () => ({
  WebGLRenderer: jest.fn(() => mockWebGLRenderer),
  Scene: jest.fn(() => mockScene),
  PerspectiveCamera: jest.fn(() => mockCamera),
  Color: jest.fn(),
  PCFSoftShadowMap: 'PCFSoftShadowMap'
}));