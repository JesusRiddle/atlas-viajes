'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { checkTripScope } = require('../scripts/editorial-change-scope.cjs');

test('edición aislada acepta su viaje, scripts y documentación, no otros JSON', () => {
  const files = ['data/trips/colombia-2027.json', 'components/trip.js', 'docs/trip-editorial-guide.md'];
  assert.deepEqual(checkTripScope(files, ['colombia-2027']), []);
  assert.deepEqual(checkTripScope([...files, 'data/trips/italia-norte-2027.json'],
    ['colombia-2027']).map(x => x.path), ['data/trips/italia-norte-2027.json']);
});
test('edición de varios viajes es legítima cuando se declara explícitamente su alcance', () => {
  const files = ['data/trips/colombia-2027.json', 'data/trips/italia-norte-2027.json'];
  assert.deepEqual(checkTripScope(files, ['colombia-2027', 'italia-norte-2027']), []);
  assert.deepEqual(checkTripScope(files, ['data/trips/colombia-2027.json']).length, 1);
});
test('no confunde archivos técnicos con itinerarios ni altera el conjunto original', () => {
  const files = ['data/places.json', 'data/trips/_template.json', 'scripts/validate.cjs'];
  const copy = [...files];
  assert.deepEqual(checkTripScope(files, []), [
    { path: 'data/trips/_template.json', message: 'JSON de viaje modificado fuera del alcance declarado' }
  ]);
  assert.deepEqual(files, copy);
  assert.throws(() => checkTripScope('cadena', []), TypeError);
});
