import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('\\n')) {
        try {
            // Sometimes it's a JSON string literal, so JSON.parse could work if it's quoted.
            // But let's just do a regex replace for the literal \n.
            let newContent = content;
            // If it starts with quote and ends with quote + \n
            if (newContent.startsWith('"') && newContent.trim().endsWith('"')) {
                newContent = newContent.substring(1, newContent.lastIndexOf('"'));
            }
            newContent = newContent.replace(/\\n/g, '\n').replace(/\\"/g, '"');

            fs.writeFileSync(filePath, newContent);
            console.log('Fixed', filePath);
        } catch (e) {
            console.log('Failed to fix', filePath);
        }
    }
}

function traverseAndFix(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!['node_modules', '.next', '.git'].includes(file)) {
                traverseAndFix(fullPath);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
            fixFile(fullPath);
        }
    }
}

traverseAndFix(process.cwd());
console.log('Fixes complete.');
