const fs = require('fs');
const path = require('path');

const dir = './components/ui';

fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Remove the rogue absolute background divs that were converted to red
  // Example: <div className="absolute inset-0 bg-brand-primary" />
  const replace1 = /<div className=\"absolute inset-0 bg-brand-primary\" \/>/g;
  if(replace1.test(content)){
     content = content.replace(replace1, '');
     changed = true;
  }
  
  // Also check for any section or outer div wrappers that got assigned solid red
  const replace2 = /className=\"([^"]*)bg-brand-primary([^"]*)\"/g;
  if (replace2.test(content)) {
    // Only target those that look like full section backgrounds (have py- or min-h) 
    // to avoid breaking red buttons
    content = content.replace(replace2, (match, p1, p2) => {
        if (match.includes('py-') || match.includes('min-h-')) {
            changed = true;
            return `className="${p1}bg-[#F5F3EE]${p2}"`;
        }
        return match;
    });
  }

  // Restore py- bg to F5F3EE if it was changed to red (another iteration just in case)
  const replace3 = /className=\"bg-brand-primary py-/g;
  if(replace3.test(content)){
      content = content.replace(replace3, 'className=\"bg-[#F5F3EE] py-');
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed red background in', file);
  }
});

// Also check page.tsx
const pagePath = './app/page.tsx';
if (fs.existsSync(pagePath)) {
    let pageContent = fs.readFileSync(pagePath, 'utf8');
    if(pageContent.includes('className=\"min-h-screen bg-brand-primary')){
        pageContent = pageContent.replace(/className=\"min-h-screen bg-brand-primary/g, 'className=\"min-h-screen bg-[#F5F3EE]');
        fs.writeFileSync(pagePath, pageContent);
        console.log('Fixed red background in app/page.tsx');
    }
}
