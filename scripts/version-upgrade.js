const fs = require('fs');

console.log(__dirname);


const currentVersion = require('../package.json').version;
const manifest = require('../public/manifest');


manifest.version = currentVersion;

console.log(manifest);

// fs.writeFileSync('./../public/manifest.json', manifest,{});
