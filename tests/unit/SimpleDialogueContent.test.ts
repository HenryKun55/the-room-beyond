import { SimpleDialogueContent } from '@/content/SimpleDialogueContent';

describe('SimpleDialogueContent', () => {
  describe('Object Descriptions', () => {
    test('should return phone description', () => {
      const description = SimpleDialogueContent.getObjectDescription('phone');
      
      expect(description).toBeDefined();
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(10);
      expect(description.toLowerCase()).toContain('phone');
    });

    test('should return laptop description', () => {
      const description = SimpleDialogueContent.getObjectDescription('laptop');
      
      expect(description).toBeDefined();
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(10);
      expect(description.toLowerCase()).toContain('laptop');
    });

    test('should return vr_headset description', () => {
      const description = SimpleDialogueContent.getObjectDescription('vr_headset');
      
      expect(description).toBeDefined();
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(10);
      expect(description.toLowerCase()).toContain('vr');
    });

    test('should return alarm_clock description', () => {
      const description = SimpleDialogueContent.getObjectDescription('alarm_clock');
      
      expect(description).toBeDefined();
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(10);
      expect(description.toLowerCase()).toContain('clock');
    });

    test('should return desk description', () => {
      const description = SimpleDialogueContent.getObjectDescription('desk');
      
      expect(description).toBeDefined();
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(10);
      expect(description.toLowerCase()).toContain('desk');
    });

    test('should return bed description', () => {
      const description = SimpleDialogueContent.getObjectDescription('bed');
      
      expect(description).toBeDefined();
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(10);
      expect(description.toLowerCase()).toContain('bed');
    });

    test('should return chair description', () => {
      const description = SimpleDialogueContent.getObjectDescription('chair');
      
      expect(description).toBeDefined();
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(10);
      expect(description.toLowerCase()).toContain('chair');
    });

    test('should return null for unknown object', () => {
      const description = SimpleDialogueContent.getObjectDescription('unknown_object');
      
      expect(description).toBeNull();
    });

    test('should maintain first person perspective in all descriptions', () => {
      const objectIds = ['phone', 'laptop', 'vr_headset', 'alarm_clock', 'desk', 'bed', 'chair'];
      
      objectIds.forEach(objectId => {
        const description = SimpleDialogueContent.getObjectDescription(objectId);
        expect(description).toBeDefined();
        
        const text = description!.toLowerCase();
        // Should have first person indicators
        expect(
          text.includes('i ') || 
          text.includes('my ') || 
          text.includes('me ')
        ).toBe(true);
        
        // Should not use second person
        expect(text.includes('you ')).toBe(false);
      });
    });

    test('should include agoraphobia themes in descriptions', () => {
      const objectIds = ['phone', 'laptop', 'vr_headset', 'alarm_clock', 'desk', 'bed', 'chair'];
      const agoraphobiaKeywords = [
        'anxiety', 'fear', 'isolation', 'trapped', 'safe', 'outside', 
        'world', 'avoid', 'escape', 'overwhelm', 'comfort', 'hiding'
      ];
      
      let thematicContent = 0;
      
      objectIds.forEach(objectId => {
        const description = SimpleDialogueContent.getObjectDescription(objectId);
        expect(description).toBeDefined();
        
        const text = description!.toLowerCase();
        if (agoraphobiaKeywords.some(keyword => text.includes(keyword))) {
          thematicContent++;
        }
      });
      
      // At least half the objects should have thematic content
      expect(thematicContent).toBeGreaterThanOrEqual(3);
    });

    test('should provide meaningful length descriptions', () => {
      const objectIds = ['phone', 'laptop', 'vr_headset', 'alarm_clock', 'desk', 'bed', 'chair'];
      
      objectIds.forEach(objectId => {
        const description = SimpleDialogueContent.getObjectDescription(objectId);
        expect(description).toBeDefined();
        
        // Should be substantial but not too long (good for single display)
        expect(description!.length).toBeGreaterThan(30);
        expect(description!.length).toBeLessThan(300);
      });
    });
  });
});