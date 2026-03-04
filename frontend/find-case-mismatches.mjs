import fs from 'fs';
import path from 'path';

function checkDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                checkDirectory(fullPath);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
            checkFile(fullPath);
        }
    }
}

function checkExactCaseExistence(importPath, currentDir) {
    const dir = path.dirname(importPath);
    const base = path.basename(importPath);

    try {
        const absDir = path.resolve(currentDir, dir);
        if (!fs.existsSync(absDir)) return null;

        const filesInDir = fs.readdirSync(absDir);

        for (const f of filesInDir) {
            const fNoExt = f.replace(/\.(ts|tsx|js|jsx)$/, '');
            const baseNoExt = base.replace(/\.(ts|tsx|js|jsx)$/, '');

            if (fNoExt.toLowerCase() === baseNoExt.toLowerCase() && fNoExt !== baseNoExt) {
                return f; // Mismatch
            }
        }
    } catch (e) { }
    return null;
}

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /(?:import|export)\s+.*?from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            const mismatch = checkExactCaseExistence(importPath, path.dirname(filePath));
            if (mismatch) {
                console.log(`Mismatch in ${filePath}: Imported '${importPath}', Actual '${mismatch}'`);
            }
        } else if (importPath.startsWith('@/')) {
            // '@/' resolving to src/ or app/ depending on tsconfig. In this app, it resolves to './*' but let's check both frontend root, src/ and app/
            const relativePath = importPath.substring(2);
            const rootDir = process.cwd();

            let mismatch = checkExactCaseExistence('./' + relativePath, rootDir);
            if (!mismatch) mismatch = checkExactCaseExistence('./src/' + relativePath, rootDir);

            if (mismatch) {
                console.log(`Mismatch in ${filePath}: Imported '${importPath}', Actual '${mismatch}'`);
            }
        }
    }
}

console.log('Starting case mismatch check...');
checkDirectory(process.cwd());
console.log('Finished checking.');
