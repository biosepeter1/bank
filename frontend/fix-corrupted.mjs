import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Only target files that were flattened into 1 or 2 lines
    if (lines.length <= 2 && content.includes('\\n')) {
        try {
            let toParse = content.trim();
            if (!toParse.startsWith('"')) toParse = '"' + toParse;
            if (!toParse.endsWith('"')) toParse = toParse + '"';
            let newContent = JSON.parse(toParse);

            fs.writeFileSync(filePath, newContent);
            console.log('Fixed exactly 1-line corrupted file with JSON.parse:', filePath);
        } catch (e) {
            console.log('Failed to fix with JSON.parse:', filePath, e.message);
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

traverseAndFix(path.join(process.cwd(), 'src'));
console.log('Safe unescape fixes complete.');
