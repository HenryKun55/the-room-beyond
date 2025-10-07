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
  updateProjectionMatrix: jest.fn(),
  quaternion: { copy: jest.fn() },
  getWorldDirection: jest.fn()
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
  PCFSoftShadowMap: 'PCFSoftShadowMap',
  Vector3: jest.fn((x = 0, y = 0, z = 0) => ({
    x, y, z,
    set: jest.fn(),
    add: jest.fn(),
    sub: jest.fn(),
    normalize: jest.fn(),
    multiplyScalar: jest.fn(),
    length: jest.fn(() => 1),
    clone: jest.fn(() => ({ x, y, z })),
    copy: jest.fn(),
    crossVectors: jest.fn(),
    distanceTo: jest.fn(() => 1)
  })),
  Quaternion: jest.fn(() => ({
    setFromAxisAngle: jest.fn(),
    multiplyQuaternions: jest.fn(),
    copy: jest.fn()
  })),
  Vector2: jest.fn(() => ({
    x: 0, y: 0,
    set: jest.fn()
  })),
  Raycaster: jest.fn(() => ({
    setFromCamera: jest.fn(),
    intersectObjects: jest.fn(() => [])
  })),
  Box3: jest.fn(() => {
    const mockBox = {
      setFromObject: jest.fn(() => mockBox),
      expandByScalar: jest.fn(() => mockBox),
      containsPoint: jest.fn(() => false)
    };
    return mockBox;
  }),
  MeshBasicMaterial: jest.fn(() => ({
    type: 'MeshBasicMaterial',
    color: { setHex: jest.fn() },
    side: 0,
    transparent: false,
    opacity: 1
  })),
  BackSide: 1
}));