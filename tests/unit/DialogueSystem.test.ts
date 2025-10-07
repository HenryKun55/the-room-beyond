import { DialogueSystem } from '@systems/DialogueSystem';
import { DialogueNode } from '../types/interfaces';

describe('DialogueSystem', () => {
  let dialogueSystem: DialogueSystem;

  beforeEach(() => {
    dialogueSystem = new DialogueSystem();
  });

  describe('Dialogue Node Management', () => {
    test('should add dialogue node', () => {
      const node: DialogueNode = {
        id: 'test_node',
        speaker: 'Narrator',
        text: 'Test dialogue text',
        choices: []
      };

      dialogueSystem.addNode(node);
      const retrievedNode = dialogueSystem.getNode('test_node');
      
      expect(retrievedNode).toEqual(node);
    });

    test('should return null for non-existent node', () => {
      const node = dialogueSystem.getNode('non_existent');
      expect(node).toBeNull();
    });

    test('should update existing node', () => {
      const originalNode: DialogueNode = {
        id: 'update_test',
        speaker: 'Original',
        text: 'Original text',
        choices: []
      };

      const updatedNode: DialogueNode = {
        id: 'update_test',
        speaker: 'Updated',
        text: 'Updated text',
        choices: []
      };

      dialogueSystem.addNode(originalNode);
      dialogueSystem.addNode(updatedNode);
      
      const retrievedNode = dialogueSystem.getNode('update_test');
      expect(retrievedNode).toEqual(updatedNode);
    });

    test('should remove dialogue node', () => {
      const node: DialogueNode = {
        id: 'remove_test',
        speaker: 'Test',
        text: 'Test',
        choices: []
      };

      dialogueSystem.addNode(node);
      expect(dialogueSystem.getNode('remove_test')).toEqual(node);
      
      dialogueSystem.removeNode('remove_test');
      expect(dialogueSystem.getNode('remove_test')).toBeNull();
    });
  });

  describe('Dialogue Flow', () => {
    beforeEach(() => {
      // Set up a dialogue tree
      const node1: DialogueNode = {
        id: 'start',
        speaker: 'Narrator',
        text: 'You wake up in a dark room.',
        choices: [
          { text: 'Look around', nextNodeId: 'look' },
          { text: 'Stay still', nextNodeId: 'still' }
        ]
      };

      const node2: DialogueNode = {
        id: 'look',
        speaker: 'Narrator',
        text: 'The room is cluttered with technology.',
        choices: [
          { text: 'Continue', nextNodeId: 'continue' }
        ]
      };

      const node3: DialogueNode = {
        id: 'still',
        speaker: 'Narrator',
        text: 'The silence is deafening.',
        choices: []
      };

      const node4: DialogueNode = {
        id: 'continue',
        speaker: 'Narrator',
        text: 'You notice several objects.',
        choices: []
      };

      dialogueSystem.addNode(node1);
      dialogueSystem.addNode(node2);
      dialogueSystem.addNode(node3);
      dialogueSystem.addNode(node4);
    });

    test('should start dialogue at specified node', () => {
      dialogueSystem.startDialogue('start');
      
      expect(dialogueSystem.isActive()).toBe(true);
      expect(dialogueSystem.getCurrentNode()?.id).toBe('start');
    });

    test('should not start dialogue with invalid node', () => {
      dialogueSystem.startDialogue('invalid');
      
      expect(dialogueSystem.isActive()).toBe(false);
      expect(dialogueSystem.getCurrentNode()).toBeNull();
    });

    test('should navigate to next node via choice', () => {
      dialogueSystem.startDialogue('start');
      
      const currentNode = dialogueSystem.getCurrentNode();
      expect(currentNode?.id).toBe('start');
      
      // Choose first option (Look around -> look)
      dialogueSystem.selectChoice(0);
      
      expect(dialogueSystem.getCurrentNode()?.id).toBe('look');
    });

    test('should handle invalid choice selection', () => {
      dialogueSystem.startDialogue('start');
      
      // Try to select choice that doesn't exist
      dialogueSystem.selectChoice(99);
      
      // Should stay on same node
      expect(dialogueSystem.getCurrentNode()?.id).toBe('start');
    });

    test('should end dialogue when no choices available', () => {
      dialogueSystem.startDialogue('start');
      dialogueSystem.selectChoice(1); // Stay still -> still (no choices)
      
      expect(dialogueSystem.getCurrentNode()?.id).toBe('still');
      expect(dialogueSystem.getCurrentNode()?.choices).toHaveLength(0);
    });

    test('should manually end dialogue', () => {
      dialogueSystem.startDialogue('start');
      expect(dialogueSystem.isActive()).toBe(true);
      
      dialogueSystem.endDialogue();
      
      expect(dialogueSystem.isActive()).toBe(false);
      expect(dialogueSystem.getCurrentNode()).toBeNull();
    });
  });

  describe('Event System', () => {
    test('should emit dialogue start event', () => {
      const startCallback = jest.fn();
      dialogueSystem.onDialogueStart(startCallback);
      
      const node: DialogueNode = {
        id: 'event_test',
        speaker: 'Test',
        text: 'Test',
        choices: []
      };
      
      dialogueSystem.addNode(node);
      dialogueSystem.startDialogue('event_test');
      
      expect(startCallback).toHaveBeenCalledWith(node);
    });

    test('should emit dialogue end event', () => {
      const endCallback = jest.fn();
      dialogueSystem.onDialogueEnd(endCallback);
      
      const node: DialogueNode = {
        id: 'end_test',
        speaker: 'Test',
        text: 'Test',
        choices: []
      };
      
      dialogueSystem.addNode(node);
      dialogueSystem.startDialogue('end_test');
      dialogueSystem.endDialogue();
      
      expect(endCallback).toHaveBeenCalled();
    });

    test('should emit node change event', () => {
      const changeCallback = jest.fn();
      dialogueSystem.onNodeChange(changeCallback);
      
      const node1: DialogueNode = {
        id: 'change1',
        speaker: 'Test',
        text: 'First',
        choices: [{ text: 'Next', nextNodeId: 'change2' }]
      };
      
      const node2: DialogueNode = {
        id: 'change2',
        speaker: 'Test',
        text: 'Second',
        choices: []
      };
      
      dialogueSystem.addNode(node1);
      dialogueSystem.addNode(node2);
      dialogueSystem.startDialogue('change1');
      dialogueSystem.selectChoice(0);
      
      expect(changeCallback).toHaveBeenCalledWith(node2, node1);
    });

    test('should remove event listeners', () => {
      const callback = jest.fn();
      dialogueSystem.onDialogueStart(callback);
      dialogueSystem.removeListener('dialogueStart', callback);
      
      const node: DialogueNode = {
        id: 'remove_test',
        speaker: 'Test',
        text: 'Test',
        choices: []
      };
      
      dialogueSystem.addNode(node);
      dialogueSystem.startDialogue('remove_test');
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Dialogue History', () => {
    test('should track visited nodes', () => {
      const node1: DialogueNode = {
        id: 'history1',
        speaker: 'Test',
        text: 'First',
        choices: [{ text: 'Next', nextNodeId: 'history2' }]
      };
      
      const node2: DialogueNode = {
        id: 'history2',
        speaker: 'Test',
        text: 'Second',
        choices: []
      };
      
      dialogueSystem.addNode(node1);
      dialogueSystem.addNode(node2);
      
      dialogueSystem.startDialogue('history1');
      dialogueSystem.selectChoice(0);
      
      const history = dialogueSystem.getHistory();
      expect(history).toEqual(['history1', 'history2']);
    });

    test('should check if node was visited', () => {
      const node: DialogueNode = {
        id: 'visited_test',
        speaker: 'Test',
        text: 'Test',
        choices: []
      };
      
      dialogueSystem.addNode(node);
      
      expect(dialogueSystem.hasVisited('visited_test')).toBe(false);
      
      dialogueSystem.startDialogue('visited_test');
      
      expect(dialogueSystem.hasVisited('visited_test')).toBe(true);
    });

    test('should clear history', () => {
      const node: DialogueNode = {
        id: 'clear_test',
        speaker: 'Test',
        text: 'Test',
        choices: []
      };
      
      dialogueSystem.addNode(node);
      dialogueSystem.startDialogue('clear_test');
      
      expect(dialogueSystem.getHistory()).toHaveLength(1);
      
      dialogueSystem.clearHistory();
      
      expect(dialogueSystem.getHistory()).toHaveLength(0);
      expect(dialogueSystem.hasVisited('clear_test')).toBe(false);
    });
  });

  describe('Conditional Logic', () => {
    test('should filter choices based on conditions', () => {
      const node: DialogueNode = {
        id: 'conditional_test',
        speaker: 'Test',
        text: 'Test with conditions',
        choices: [
          { text: 'Always available', nextNodeId: 'always' },
          { text: 'Requires flag', nextNodeId: 'flagged', condition: 'test_flag' },
          { text: 'Requires visited node', nextNodeId: 'visited', condition: 'visited:other_node' }
        ]
      };
      
      dialogueSystem.addNode(node);
      dialogueSystem.startDialogue('conditional_test');
      
      // Without flags/visits, only first choice should be available
      const availableChoices = dialogueSystem.getAvailableChoices();
      expect(availableChoices).toHaveLength(1);
      expect(availableChoices[0].text).toBe('Always available');
    });

    test('should evaluate flag conditions', () => {
      const mockFlagChecker = jest.fn().mockReturnValue(true);
      dialogueSystem.setFlagChecker(mockFlagChecker);
      
      const node: DialogueNode = {
        id: 'flag_test',
        speaker: 'Test',
        text: 'Test',
        choices: [
          { text: 'Requires flag', nextNodeId: 'flagged', condition: 'has_key' }
        ]
      };
      
      dialogueSystem.addNode(node);
      dialogueSystem.startDialogue('flag_test');
      
      const availableChoices = dialogueSystem.getAvailableChoices();
      expect(availableChoices).toHaveLength(1);
      expect(mockFlagChecker).toHaveBeenCalledWith('has_key');
    });
  });

  describe('State Management', () => {
    test('should save and restore dialogue state', () => {
      const node1: DialogueNode = {
        id: 'save1',
        speaker: 'Test',
        text: 'First',
        choices: [{ text: 'Next', nextNodeId: 'save2' }]
      };
      
      const node2: DialogueNode = {
        id: 'save2',
        speaker: 'Test',
        text: 'Second',
        choices: []
      };
      
      dialogueSystem.addNode(node1);
      dialogueSystem.addNode(node2);
      dialogueSystem.startDialogue('save1');
      dialogueSystem.selectChoice(0);
      
      const state = dialogueSystem.exportState();
      expect(state.currentNodeId).toBe('save2');
      expect(state.history).toEqual(['save1', 'save2']);
      expect(state.isActive).toBe(true);
      
      const newDialogueSystem = new DialogueSystem();
      newDialogueSystem.addNode(node1);
      newDialogueSystem.addNode(node2);
      newDialogueSystem.importState(state);
      
      expect(newDialogueSystem.getCurrentNode()?.id).toBe('save2');
      expect(newDialogueSystem.getHistory()).toEqual(['save1', 'save2']);
      expect(newDialogueSystem.isActive()).toBe(true);
    });
  });
});