import { DialogueContent } from '@/content/DialogueContent';

describe('Debug Start Nodes', () => {
  test('should identify actual start node names', () => {
    const allDialogue = DialogueContent.getAllDialogue();
    
    allDialogue.forEach((dialogue, objectId) => {
      console.log(`${objectId} start nodes:`, Array.from(dialogue.keys()).filter(k => k.includes('start')));
      console.log(`${objectId} all nodes:`, Array.from(dialogue.keys()));
    });
  });
});