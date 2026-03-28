const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/onboarding/ClaimAddBusinessModal.jsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Fix the missing catch block
content = content.replace(
  '        }\n\n      toast({',
  '        }\n\n      } catch (error) {\n        console.error("Business creation error:", error);\n      }\n\n      toast({'
);

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf8');

console.log('Fixed syntax error in ClaimAddBusinessModal.jsx');
