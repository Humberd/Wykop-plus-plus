const fs = require('fs');
const manifest = require('../public/manifest.json');
const currentVersion = require('../package.json').version;

console.log(__dirname);

manifest.version = currentVersion;

fs.writeFileSync('../public/manifest.json', manifest,{});
