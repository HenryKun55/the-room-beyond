import { DialogueContent } from '@/content/DialogueContent';

describe('Debug Dialogue Issues', () => {
  test('should identify nodes missing speaker field', () => {
    const allDialogue = DialogueContent.getAllDialogue();
    const missingSpeaker: string[] = [];
    
    allDialogue.forEach((dialogue, objectId) => {
      dialogue.forEach((node, nodeId) => {
        if (!node.speaker) {
          missingSpeaker.push(`${objectId}:${nodeId}`);
        }
      });
    });
    
    console.log('Nodes missing speaker field:', missingSpeaker);
    expect(missingSpeaker.length).toBe(0);
  });

  test('should identify nodes with second person perspective', () => {
    const allDialogue = DialogueContent.getAllDialogue();
    const secondPersonNodes: string[] = [];
    
    allDialogue.forEach((dialogue, objectId) => {
      dialogue.forEach((node, nodeId) => {
        const text = node.text.toLowerCase();
        if (text.includes('you ')) {
          secondPersonNodes.push(`${objectId}:${nodeId} - "${node.text.substring(0, 50)}..."`);
        }
      });
    });
    
    console.log('Nodes with second person perspective:', secondPersonNodes);
    expect(secondPersonNodes.length).toBe(0);
  });

  test('should identify nodes without first person indicators', () => {
    const allDialogue = DialogueContent.getAllDialogue();
    const problematicNodes: string[] = [];
    
    allDialogue.forEach((dialogue, objectId) => {
      dialogue.forEach((node, nodeId) => {
        const text = node.text.toLowerCase();
        const hasFirstPerson = text.includes('i ') || text.includes('my ') || text.includes('me ');
        const isPhilosophicalStatement = text.includes('anxiety') || text.includes('time') || text.includes('pattern');
        
        if (!hasFirstPerson && !isPhilosophicalStatement) {
          problematicNodes.push(`${objectId}:${nodeId} - "${node.text.substring(0, 50)}..."`);
        }
      });
    });
    
    console.log('Nodes that fail the test:', problematicNodes);
    // Not failing this test, just reporting
  });
});