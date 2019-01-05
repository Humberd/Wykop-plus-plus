const fs = require('fs');

console.log(__dirname);

const currentVersion = require('../package.json').version;

const manifest = require('../public/manifest.json');

manifest.version = currentVersion;

fs.writeFileSync('../public/manifest.json', manifest,{});
