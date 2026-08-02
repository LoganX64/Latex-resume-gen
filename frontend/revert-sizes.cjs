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
  let newContent = content
    .replace(/size="icon" sm:size="icon-xs"/g, 'size="icon-xs"')
    .replace(/size="default" sm:size="sm"/g, 'size="sm"');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Reverted sizes in ${file}`);
  }
});
