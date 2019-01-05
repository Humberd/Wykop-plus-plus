const fs = require('fs');

const currentVersion = require('../package.json').version;

const manifest = require('../public/manifest.json');

manifest.version = currentVersion;

fs.writeFileSync('../public/manifest.json', manifest,{});
