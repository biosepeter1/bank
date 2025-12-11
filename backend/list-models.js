const https = require('https');
const fs = require('fs');

const API_KEY = 'AIzaSyAEOtl1OIaHE2j-hL9FHIhapuORyZflub8';
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(URL, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.models) {
                const lines = parsed.models
                    .filter(m => m.name.includes('gemini'))
                    .map(m => `${m.name} [${m.supportedGenerationMethods.join(', ')}]`)
                    .join('\n');
                fs.writeFileSync('c:\\Users\\user\\rdn-banking-platform\\backend\\models.txt', lines);
                console.log('Written to models.txt');
            } else {
                console.log('No models found:', parsed);
            }
        } catch (e) {
            console.error('Error:', e);
        }
    });
});
