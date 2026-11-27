'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'modules.js'), 'utf8'), context);
const modules = context.window.ATLAS_MODULES;
const trips = modules.filter(m => m.available && m.homeGroup !== 'ideas').map(m => ({
  module: m, trip: JSON.parse(fs.readFileSync(path.join(root, 'data/trips', m.file), 'utf8'))
}));
module.exports = { modules, trips };
