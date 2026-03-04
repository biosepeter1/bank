import fs from 'fs';

const content = fs.readFileSync('src/stores/useUserStore.ts', 'utf8');
console.log("Original content starts with:", content.substring(0, 50));
console.log("Original content ends with:", content.substring(content.length - 50));
try {
    let toParse = content.trim();
    if (!toParse.startsWith('"')) toParse = '"' + toParse;
    if (!toParse.endsWith('"')) toParse = toParse + '"';

    // This might still be invalid if the string has unescaped internal double quotes!
    // Since it was flattened, did it escape them? Let's test.
    const parsed = JSON.parse(toParse);
    console.log("Parsed correctly!");
} catch (e) {
    console.log("Parse failed", e.message);

    // Alternative regex logic that handles \s, \", \n, \/, \r, \t safely
    let unescaped = content
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\s/g, '\\s') // if it was \\s, wait, no. 
    // wait, if it was `\s` in code, it became `\\s` in string. Unescaping makes it `\s`.
    // Actually, in JS `\s` in a string literal is just `s`. BUT in regex it's `\s`.
    // Wait, regex literals like `/\s/` are NOT strings. 
    // So the corrupted file literally has `\\s`. To unescape, `\\` -> `\`
    console.log("regex unescaped length:", unescaped.length);
}
