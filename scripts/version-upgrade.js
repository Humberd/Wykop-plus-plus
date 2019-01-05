const fs = require('fs');

console.log(__dirname);

const currentVersion = require('../package.json').version;
const manifest = require('../public/manifest.json');

manifest.version = currentVersion;

console.log(manifest);
console.log(__dirname);


fs.writeFileSync('./manifest.json', JSON.stringify(manifest),
    {encoding: 'utf8'});
