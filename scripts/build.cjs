const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const item of ['index.html', 'assets', 'data', 'LICENSE', 'NOTICE']) {
  fs.cpSync(path.join(root, item), path.join(out, item), { recursive: true });
}
console.log('Built offline static document in dist/');
