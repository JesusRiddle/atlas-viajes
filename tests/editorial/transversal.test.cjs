'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { modules, trips } = require('./catalog.cjs');
test('Catálogo: identidades únicas y archivos registrados sin cantidades fijas', () => {
  assert.ok(Array.isArray(modules));
  assert.equal(new Set(modules.map(m=>m.id)).size, modules.length);
  for (const m of modules) {
    assert.match(m.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(m.file, m.id+'.json');
  }
  for (const {module,trip} of trips) {
    assert.equal(trip.id,module.id);
    assert.ok(typeof trip.name==='string' && trip.name.trim());
  }
});
