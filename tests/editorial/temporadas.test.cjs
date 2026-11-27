'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { trips } = require('./catalog.cjs');
const { seasons, temperature, MONTHS } = require('../../scripts/editorial-contracts.cjs');
test('Temporadas: todos los meses informados respetan el contrato editorial', () => {
  for (const {module, trip} of trips) {
    if (trip.seasonality == null) continue;
    assert.deepEqual(seasons(trip.seasonality), [], module.id);
  }
});
test('Temporadas: pendiente, intervalo regional y máximas/mínimas reales', () => {
  const months = Object.fromEntries(MONTHS.map(m => [m, {status:'pending', description:null}]));
  assert.deepEqual(seasons({months}), []);
  months['01'] = {status:'recommended', description:'Máx. 5 °C · Mín. −3 °C'};
  months['02'] = {status:'conditional', description:'Máximas entre regiones: −3 a 5 °C'};
  assert.deepEqual(seasons({months}), []);
  assert.equal(temperature(months['02'].description).kind, 'legacy-interval');
  months['01'].description = 'Máx. −3 °C · Mín. 5 °C';
  assert.ok(seasons({months}).some(e => e.path.endsWith('01')));
  delete months['12'];
  assert.ok(seasons({months}).some(e => e.path.endsWith('12')));
});
