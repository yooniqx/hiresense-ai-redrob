const fs = require('fs');
const path = require('path');

// Map of @/ imports to their relative paths from different locations
const getRelativePath = (fromFile, toPath) => {
  const fromDir = path.dirname(fromFile);
  const toFile = path.join('src', toPath);
  let relative = path.relative(fromDir, toFile).replace(/\\/g, '/');
  if (!relative.startsWith('.')) {
    relative = './' + relative;
  }
  return relative;
};

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace @/lib/api
  if (content.includes('@/lib/api')) {
    const relativePath = getRelativePath(filePath, 'lib/api');
    content = content.replace(/@\/lib\/api/g, relativePath);
    modified = true;
  }

  // Replace @/lib/utils
  if (content.includes('@/lib/utils')) {
    const relativePath = getRelativePath(filePath, 'lib/utils');
    content = content.replace(/@\/lib\/utils/g, relativePath);
    modified = true;
  }

  // Replace @/lib/dummy-data
  if (content.includes('@/lib/dummy-data')) {
    const relativePath = getRelativePath(filePath, 'lib/dummy-data');
    content = content.replace(/@\/lib\/dummy-data/g, relativePath);
    modified = true;
  }

  // Replace @/components/AppLayout
  if (content.includes('@/components/AppLayout')) {
    const relativePath = getRelativePath(filePath, 'components/AppLayout');
    content = content.replace(/@\/components\/AppLayout/g, relativePath);
    modified = true;
  }

  // Replace @/components/ui-kit
  if (content.includes('@/components/ui-kit')) {
    const relativePath = getRelativePath(filePath, 'components/ui-kit');
    content = content.replace(/@\/components\/ui-kit/g, relativePath);
    modified = true;
  }

  // Replace @/components/ui/*
  const uiComponentMatch = content.match(/@\/components\/ui\/[\w-]+/g);
  if (uiComponentMatch) {
    uiComponentMatch.forEach(match => {
      const componentPath = match.replace('@/', '');
      const relativePath = getRelativePath(filePath, componentPath);
      content = content.replace(new RegExp(match.replace(/\//g, '\\/'), 'g'), relativePath);
    });
    modified = true;
  }

  // Replace @/pages/*
  const pagesMatch = content.match(/@\/pages\/[\w-]+/g);
  if (pagesMatch) {
    pagesMatch.forEach(match => {
      const pagePath = match.replace('@/', '');
      const relativePath = getRelativePath(filePath, pagePath);
      content = content.replace(new RegExp(match.replace(/\//g, '\\/'), 'g'), relativePath);
    });
    modified = true;
  }

  // Replace @/hooks/*
  const hooksMatch = content.match(/@\/hooks\/[\w-]+/g);
  if (hooksMatch) {
    hooksMatch.forEach(match => {
      const hookPath = match.replace('@/', '');
      const relativePath = getRelativePath(filePath, hookPath);
      content = content.replace(new RegExp(match.replace(/\//g, '\\/'), 'g'), relativePath);
    });
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  }
};

const walkDir = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      processFile(filePath);
    }
  });
};

console.log('🔧 Fixing @/ imports...\n');
walkDir('src');
console.log('\n✨ Done!');

// Made with Bob
