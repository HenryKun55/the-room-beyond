const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/content/DialogueContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Add speaker field to all nodes that are missing it
// Pattern: nodes.set('node_id', {\n      id: 'node_id',\n      text: "..."
const pattern = /(nodes\.set\('[^']+', \{\s*id: '[^']+',)\s*(text: "[^"]*")/g;

content = content.replace(pattern, '$1\n      speaker: \'Inner Voice\',\n      $2');

// Fix the specific second person references
content = content.replace(
  'But safety can become a cage if you never leave it.',
  'But safety can become a cage if I never leave it.'
);

content = content.replace(
  'How do you rest a restless mind?',
  'How do I rest a restless mind?'
);

fs.writeFileSync(filePath, content);
console.log('Fixed DialogueContent.ts');