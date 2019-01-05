const fs = require('fs');
const path = require('path');

const currentVersion = require('../package.json').version;
const manifest = require('../public/manifest.json');

manifest.version = currentVersion;

fs.writeFileSync(path.resolve(__dirname, '../public/manifest.json'), JSON.stringify(manifest, null, 2),
    {encoding: 'utf8'});
