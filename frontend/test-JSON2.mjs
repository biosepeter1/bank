import fs from 'fs';

const content = fs.readFileSync('src/stores/useUserStore.ts', 'utf8');
try {
    let toParse = content.trim();
    // Ensure it's wrapped in double quotes in case it isn't
    if (!toParse.startsWith('"')) toParse = '"' + toParse;
    if (!toParse.endsWith('"')) toParse = toParse + '"';

    const parsed = JSON.parse(toParse);
    if (parsed.includes('import { create }')) {
        console.log("Parsed correctly via JSON!");
        console.log("Length:", parsed.length);
    }
} catch (e) {
    console.log("Parse failed", e.message);
}
