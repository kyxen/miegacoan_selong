const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const rootDir = __dirname;
const docsDir = path.join(__dirname, 'docs');

const itemsToSync = [
  'index.html',
  'menu.html',
  'promo.html',
  'lokasi.html',
  'tentang.html',
  'data',
  'styles',
  'js',
  'assets',
  'components',
  'pages'
];

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('🔄 Syncing src/ files to project root and docs/ for GitHub Pages...');

itemsToSync.forEach((item) => {
  const srcPath = path.join(srcDir, item);
  if (fs.existsSync(srcPath)) {
    // Sync to root
    copyRecursiveSync(srcPath, path.join(rootDir, item));
    // Sync to docs
    copyRecursiveSync(srcPath, path.join(docsDir, item));
    console.log(`✓ Synced: ${item}`);
  }
});

console.log('✅ Sync completed successfully!');
