# Known Bugs and Issues

## 🚨 Critical Bugs

### 1. Collision Detection Not Working
**Status**: Active  
**Priority**: High  
**Description**: Player can walk through all interactive objects (bed, chair, desk, etc.) despite collision detection system being implemented.

**Technical Details**:
- Collision detection system is registered and running
- Debug logs show objects are detected with correct distances
- `expandByScalar()` + `containsPoint()` method returns false even when player should collide
- Wall collision works correctly, but object collision fails

**Attempted Fixes**:
- ✅ Tried sphere intersection method (`intersectsSphere()`)
- ✅ Reverted to box expansion method
- ✅ Added comprehensive debug logging
- ✅ Increased collision radius from 0.3 to 0.5
- ✅ Verified bounding box calculation with `setFromObject()`

**Debug Output Example**:
```
Object bed: distance=0.92, collision=false, box: Vector3 {...}
Object chair: distance=0.31, collision=false, box: Vector3 {...}
```

**Next Steps to Try**:
- [ ] Investigate if bounding boxes are computed correctly for ObjectFactory meshes
- [ ] Try alternative collision methods (raycasting, custom geometry bounds)
- [ ] Check if mesh transformations affect bounding box calculations
- [ ] Test with simpler collision shapes (sphere-to-sphere)

**Files Involved**:
- `src/core/CameraController.ts:182-197` - Collision detection logic
- `src/main.ts:105-114` - Collision setup
- `src/core/ObjectFactory.ts` - Object creation that may affect bounding boxes

---

## 🐛 Minor Issues

### 2. Canvas Context Warnings in Tests
**Status**: Active  
**Priority**: Low  
**Description**: Jest tests show canvas context errors when running texture-related tests.

**Error Message**:
```
Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)
```

**Current Workaround**: 
- RoomFactory constructor accepts `useTextures: boolean = true` parameter
- Tests run with `useTextures: false` to avoid canvas dependency
- Production code still uses textures normally

**Potential Fix**: Install `canvas` npm package for Jest environment

---

## 🔧 Technical Debt

### 3. TypeScript Jest Configuration Deprecation
**Status**: Active  
**Priority**: Low  
**Description**: Jest shows deprecation warning about ts-jest configuration.

**Warning Message**:
```
ts-jest[ts-jest-transformer] (WARN) Define `ts-jest` config under `globals` is deprecated
```

**Fix Required**: Update Jest configuration to use modern ts-jest setup

---

## 📋 Investigation Notes

### Collision Detection Deep Dive
- Player radius: 0.5 units
- Room bounds: ±3.8 units (working correctly)
- Object positions verified correct in debug logs
- Bounding boxes show reasonable min/max values
- Distance calculation appears accurate
- Issue seems to be in the final `containsPoint()` check

### Debugging Commands Used
```typescript
console.log(`${object.userData.id} original box:`, box.min, box.max);
console.log(`Object ${object.userData?.id}: distance=${distance.toFixed(2)}, collision=${collision}, position:`, position);
```

---

## 🔍 Future Investigation Areas

1. **Three.js Version Compatibility**: Check if our Three.js version has known bounding box issues
2. **ObjectFactory Mesh Structure**: Investigate if Group vs Mesh affects collision detection
3. **Coordinate System**: Verify world vs local coordinate system usage
4. **Performance**: Current collision system checks all objects every frame - could be optimized
5. **Alternative Approaches**: Consider physics engine integration (Cannon.js, Ammo.js)

---

*Last Updated: October 8, 2025*  
*Next Review: When collision system is fixed*