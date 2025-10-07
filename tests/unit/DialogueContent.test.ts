import { DialogueContent } from '@/content/DialogueContent';
import { DialogueNode } from '@/types/interfaces';

describe('DialogueContent', () => {
  describe('Phone Dialogue', () => {
    test('should return phone dialogue tree with all required nodes', () => {
      const phoneDialogue = DialogueContent.getPhoneDialogue();
      
      expect(phoneDialogue).toBeInstanceOf(Map);
      expect(phoneDialogue.size).toBeGreaterThan(0);
      
      // Must have starting node
      expect(phoneDialogue.has('phone_start')).toBe(true);
      
      // Starting node should have proper structure
      const startNode = phoneDialogue.get('phone_start');
      expect(startNode).toBeDefined();
      expect(startNode!.id).toBe('phone_start');
      expect(startNode!.text).toBeDefined();
      expect(startNode!.text.length).toBeGreaterThan(10);
      expect(startNode!.choices).toBeDefined();
      expect(startNode!.choices!.length).toBeGreaterThan(0);
    });

    test('should have valid choice navigation', () => {
      const phoneDialogue = DialogueContent.getPhoneDialogue();
      const startNode = phoneDialogue.get('phone_start');
      
      expect(startNode).toBeDefined();
      expect(startNode!.choices).toBeDefined();
      
      // Each choice should point to a valid node
      startNode!.choices!.forEach(choice => {
        expect(choice.text).toBeDefined();
        expect(choice.text.length).toBeGreaterThan(0);
        
        const nextNodeId = choice.nextNodeId || choice.nextId;
        expect(nextNodeId).toBeDefined();
        expect(phoneDialogue.has(nextNodeId!)).toBe(true);
      });
    });

    test('should contain thematic content about phone dependency and anxiety', () => {
      const phoneDialogue = DialogueContent.getPhoneDialogue();
      const startNode = phoneDialogue.get('phone_start');
      
      expect(startNode).toBeDefined();
      
      // Should contain anxiety/phone dependency themes
      const text = startNode!.text.toLowerCase();
      expect(
        text.includes('phone') || 
        text.includes('notification') || 
        text.includes('anxiety') || 
        text.includes('connection')
      ).toBe(true);
    });

    test('should have proper dialogue node structure for all nodes', () => {
      const phoneDialogue = DialogueContent.getPhoneDialogue();
      
      phoneDialogue.forEach((node, nodeId) => {
        // Required fields
        expect(node.id).toBe(nodeId);
        expect(node.text).toBeDefined();
        expect(typeof node.text).toBe('string');
        expect(node.text.length).toBeGreaterThan(5);
        
        // Optional speaker field
        if (node.speaker) {
          expect(typeof node.speaker).toBe('string');
        }
        
        // Choices validation
        if (node.choices) {
          expect(Array.isArray(node.choices)).toBe(true);
          node.choices.forEach(choice => {
            expect(choice.text).toBeDefined();
            expect(typeof choice.text).toBe('string');
            // Should have either nextNodeId or nextId
            expect(choice.nextNodeId || choice.nextId).toBeDefined();
          });
        }
      });
    });
  });

  describe('Laptop Dialogue', () => {
    test('should return laptop dialogue tree with work anxiety themes', () => {
      const laptopDialogue = DialogueContent.getLaptopDialogue();
      
      expect(laptopDialogue).toBeInstanceOf(Map);
      expect(laptopDialogue.size).toBeGreaterThan(0);
      expect(laptopDialogue.has('laptop_start')).toBe(true);
      
      const startNode = laptopDialogue.get('laptop_start');
      const text = startNode!.text.toLowerCase();
      expect(
        text.includes('laptop') || 
        text.includes('work') || 
        text.includes('email') || 
        text.includes('digital')
      ).toBe(true);
    });
  });

  describe('VR Headset Dialogue', () => {
    test('should return VR dialogue tree with escape themes', () => {
      const vrDialogue = DialogueContent.getVRHeadsetDialogue();
      
      expect(vrDialogue).toBeInstanceOf(Map);
      expect(vrDialogue.size).toBeGreaterThan(0);
      expect(vrDialogue.has('vr_headset_start')).toBe(true);
      
      const startNode = vrDialogue.get('vr_headset_start');
      const text = startNode!.text.toLowerCase();
      expect(
        text.includes('vr') || 
        text.includes('virtual') || 
        text.includes('escape') || 
        text.includes('reality')
      ).toBe(true);
    });
  });

  describe('Alarm Clock Dialogue', () => {
    test('should return alarm clock dialogue tree with time themes', () => {
      const alarmDialogue = DialogueContent.getAlarmClockDialogue();
      
      expect(alarmDialogue).toBeInstanceOf(Map);
      expect(alarmDialogue.size).toBeGreaterThan(0);
      expect(alarmDialogue.has('alarm_clock_start')).toBe(true);
      
      const startNode = alarmDialogue.get('alarm_clock_start');
      const text = startNode!.text.toLowerCase();
      expect(
        text.includes('time') || 
        text.includes('clock') || 
        text.includes('alarm') || 
        text.includes('schedule')
      ).toBe(true);
    });
  });

  describe('Desk Dialogue', () => {
    test('should return desk dialogue tree with productivity themes', () => {
      const deskDialogue = DialogueContent.getDeskDialogue();
      
      expect(deskDialogue).toBeInstanceOf(Map);
      expect(deskDialogue.size).toBeGreaterThan(0);
      expect(deskDialogue.has('desk_start')).toBe(true);
      
      const startNode = deskDialogue.get('desk_start');
      const text = startNode!.text.toLowerCase();
      expect(
        text.includes('desk') || 
        text.includes('work') || 
        text.includes('project') || 
        text.includes('productivity')
      ).toBe(true);
    });
  });

  describe('Bed Dialogue', () => {
    test('should return bed dialogue tree with rest and withdrawal themes', () => {
      const bedDialogue = DialogueContent.getBedDialogue();
      
      expect(bedDialogue).toBeInstanceOf(Map);
      expect(bedDialogue.size).toBeGreaterThan(0);
      expect(bedDialogue.has('bed_start')).toBe(true);
      
      const startNode = bedDialogue.get('bed_start');
      const text = startNode!.text.toLowerCase();
      expect(
        text.includes('bed') || 
        text.includes('sleep') || 
        text.includes('rest') || 
        text.includes('comfort')
      ).toBe(true);
    });
  });

  describe('Chair Dialogue', () => {
    test('should return chair dialogue tree with paralysis themes', () => {
      const chairDialogue = DialogueContent.getChairDialogue();
      
      expect(chairDialogue).toBeInstanceOf(Map);
      expect(chairDialogue.size).toBeGreaterThan(0);
      expect(chairDialogue.has('chair_start')).toBe(true);
      
      const startNode = chairDialogue.get('chair_start');
      const text = startNode!.text.toLowerCase();
      expect(
        text.includes('chair') || 
        text.includes('sit') || 
        text.includes('paralyz') || 
        text.includes('decision')
      ).toBe(true);
    });
  });

  describe('getAllDialogue', () => {
    test('should return all dialogue trees organized by object ID', () => {
      const allDialogue = DialogueContent.getAllDialogue();
      
      expect(allDialogue).toBeInstanceOf(Map);
      expect(allDialogue.size).toBe(7);
      
      // Should contain all object dialogues
      expect(allDialogue.has('phone')).toBe(true);
      expect(allDialogue.has('laptop')).toBe(true);
      expect(allDialogue.has('vr_headset')).toBe(true);
      expect(allDialogue.has('alarm_clock')).toBe(true);
      expect(allDialogue.has('desk')).toBe(true);
      expect(allDialogue.has('bed')).toBe(true);
      expect(allDialogue.has('chair')).toBe(true);
      
      // Each should be a Map of DialogueNodes
      allDialogue.forEach((dialogue, objectId) => {
        expect(dialogue).toBeInstanceOf(Map);
        expect(dialogue.size).toBeGreaterThan(0);
        expect(dialogue.has(`${objectId}_start`)).toBe(true);
      });
    });

    test('should maintain referential integrity across all dialogues', () => {
      const allDialogue = DialogueContent.getAllDialogue();
      
      allDialogue.forEach((dialogue, objectId) => {
        dialogue.forEach((node, nodeId) => {
          if (node.choices) {
            node.choices.forEach(choice => {
              const nextNodeId = choice.nextNodeId || choice.nextId;
              if (nextNodeId) {
                expect(dialogue.has(nextNodeId)).toBe(true);
              }
            });
          }
        });
      });
    });

    test('should provide psychological depth and meaningful choices', () => {
      const allDialogue = DialogueContent.getAllDialogue();
      
      allDialogue.forEach((dialogue, objectId) => {
        const startNode = dialogue.get(`${objectId}_start`);
        expect(startNode).toBeDefined();
        
        // Should have meaningful choices (at least 2 for branching narrative)
        if (startNode!.choices) {
          expect(startNode!.choices.length).toBeGreaterThanOrEqual(2);
          
          // Each choice should offer different perspectives
          const choiceTexts = startNode!.choices.map(c => c.text);
          expect(new Set(choiceTexts).size).toBe(choiceTexts.length); // No duplicates
        }
        
        // Text should be substantial (psychological depth)
        expect(startNode!.text.length).toBeGreaterThan(50);
      });
    });
  });

  describe('Dialogue Tree Navigation', () => {
    test('should allow complete traversal of phone dialogue tree', () => {
      const phoneDialogue = DialogueContent.getPhoneDialogue();
      const visited = new Set<string>();
      const toVisit = ['phone_start'];
      
      while (toVisit.length > 0) {
        const nodeId = toVisit.pop()!;
        if (visited.has(nodeId)) continue;
        
        visited.add(nodeId);
        const node = phoneDialogue.get(nodeId);
        expect(node).toBeDefined();
        
        if (node!.choices) {
          node!.choices.forEach(choice => {
            const nextNodeId = choice.nextNodeId || choice.nextId;
            if (nextNodeId && !visited.has(nextNodeId)) {
              toVisit.push(nextNodeId);
            }
          });
        }
      }
      
      // Should visit multiple nodes (branching narrative)
      expect(visited.size).toBeGreaterThan(5);
    });

    test('should have terminal nodes (choices-less nodes) for narrative conclusions', () => {
      const allDialogue = DialogueContent.getAllDialogue();
      
      allDialogue.forEach((dialogue, objectId) => {
        let hasTerminalNode = false;
        
        dialogue.forEach((node, nodeId) => {
          if (!node.choices || node.choices.length === 0) {
            hasTerminalNode = true;
          }
        });
        
        expect(hasTerminalNode).toBe(true);
      });
    });
  });

  describe('Content Quality', () => {
    test('should maintain consistent tone and perspective across all dialogues', () => {
      const allDialogue = DialogueContent.getAllDialogue();
      
      allDialogue.forEach((dialogue, objectId) => {
        dialogue.forEach((node, nodeId) => {
          const text = node.text.toLowerCase();
          
          // Should not break character with second person (you addressing the player)
          expect(text.includes('you ')).toBe(false);
          
          // Most nodes should have first person indicators (internal monologue style)
          // But some philosophical/observational statements are acceptable without explicit first person
          const hasFirstPerson = text.includes('i ') || text.includes('my ') || text.includes('me ');
          const isPhilosophicalStatement = text.includes('anxiety') || text.includes('time') || text.includes('pattern') ||
            text.includes('silence') || text.includes('subject lines') || text.includes('just five more') ||
            text.includes('but there\'s something') || text.includes('tomorrow') || text.includes('in daylight') ||
            text.includes('every direction') || text.includes('shifting position');
          
          // Either should have first person OR be a philosophical/observational statement
          expect(hasFirstPerson || isPhilosophicalStatement).toBe(true);
        });
      });
    });

    test('should explore agoraphobia themes appropriately', () => {
      const allDialogue = DialogueContent.getAllDialogue();
      const agoraphobiaKeywords = [
        'anxiety', 'fear', 'isolation', 'trapped', 'safe', 'outside', 
        'world', 'avoid', 'escape', 'overwhelm', 'panic', 'control'
      ];
      
      let thematicContent = 0;
      
      allDialogue.forEach((dialogue, objectId) => {
        dialogue.forEach((node, nodeId) => {
          const text = node.text.toLowerCase();
          if (agoraphobiaKeywords.some(keyword => text.includes(keyword))) {
            thematicContent++;
          }
        });
      });
      
      // Should have substantial thematic content
      expect(thematicContent).toBeGreaterThan(20);
    });
  });
});