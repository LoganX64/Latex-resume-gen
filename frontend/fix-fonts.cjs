const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/components/editor').filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Update Textareas that have hardcoded text-xs
  content = content.replace(/className="(min-h-\[[0-px]+\])\s+text-xs\s+(resize-[a-z]+)"/g, 'className="$1 text-base sm:text-xs $2 py-2"');
  
  // Update Labels that have hardcoded text-[10px]
  content = content.replace(/className="text-\[10px\]"/g, 'className="text-xs sm:text-[10px]"');
  
  // Update Labels that have text-[9px] sm:text-[10px]
  content = content.replace(/className="text-\[9px\] sm:text-\[10px\]"/g, 'className="text-xs sm:text-[10px]"');
  
  // Update Labels that have text-[11px] sm:text-xs
  content = content.replace(/className="text-\[11px\] sm:text-xs"/g, 'className="text-sm sm:text-[11px]"');
  
  // Update PersonalInfoForm inputs which use h-8 text-xs
  content = content.replace(/className="h-8 text-xs"/g, 'className="h-10 text-base sm:h-8 sm:text-xs"');
  
  // Any specific text-xs left in labels
  content = content.replace(/<Label htmlFor="summary" className="text-xs">/g, '<Label htmlFor="summary" className="text-sm sm:text-xs">');

  if (content !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
