'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { lodgingStatusWarnings } = require('../scripts/editorial-lodging-audit.cjs');

test('distingue candidato, cotización y reserva confirmada sin inventar compras', () => {
  const trip = { hotels: [{ id: 'a', status: 'Candidato · NO reservado' }],
    expenses: [{ hotelId: 'a', status: 'estimated' }] };
  assert.deepEqual(lodgingStatusWarnings(trip), []);
  trip.expenses[0].status = 'paid';
  assert.equal(lodgingStatusWarnings(trip)[0].code, 'candidate-charged-as-booked');
  trip.hotels[0].status = 'Reserva confirmada';
  trip.expenses[0].status = 'estimated';
  assert.equal(lodgingStatusWarnings(trip)[0].code, 'booked-with-unconfirmed-ledger');
  trip.expenses[0].status = 'paid';
  assert.deepEqual(lodgingStatusWarnings(trip), []);
});
test('no considera la frase NO reservado una reserva real', () => {
  const t = { hotels: [{ id: 'a', status: 'Seleccionado, no reservado' }],
    expenses: [{ hotelId: 'a', status: 'quoted' }] };
  assert.deepEqual(lodgingStatusWarnings(t), []);
  assert.deepEqual(lodgingStatusWarnings({ hotels: [], expenses: [] }), []);
});
test('audita viajes vivos sin congelar identidad ni número de alojamientos', () => {
  const window = {};
  vm.runInNewContext(fs.readFileSync('modules.js','utf8'), { window });
  const files = window.ATLAS_MODULES.filter(m => m.available && m.homeGroup !== 'ideas');
  assert.ok(files.length);
  for (const m of files) {
    const trip = JSON.parse(fs.readFileSync('data/trips/' + m.file,'utf8'));
    const warnings = lodgingStatusWarnings(trip);
    assert.ok(Array.isArray(warnings), m.file);
    const changed = structuredClone(trip);
    changed.hotels = []; changed.expenses = [];
    assert.deepEqual(lodgingStatusWarnings(changed), [], m.file);
  }
});
