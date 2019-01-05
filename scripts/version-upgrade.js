const fs = require('fs');
const path = require('path');

console.log(__dirname);

const currentVersion = require('../package.json').version;
const manifest = require('../public/manifest.json');

manifest.version = currentVersion;

console.log(manifest);
console.log(__dirname);


const foo = path.resolve(__dirname, '../public/manifest.json');

console.log(foo);
fs.writeFileSync('./manifest.json', JSON.stringify(manifest),
    {encoding: 'utf8'});
