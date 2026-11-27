'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
// Protege un cambio acotado: ningún JSON turístico fuera del alcance declarado.
// Esta función es pura; la fase de CI debe recibir el alcance explícito del cambio.
const TRIP_PATH = /^data\/trips\/[^/]+\.json$/;
function checkTripScope(changedFiles, allowedTrips = []) {
  if (!Array.isArray(changedFiles) || !Array.isArray(allowedTrips))
    throw new TypeError('Se requieren listas de rutas y viajes permitidos');
  const allowed = new Set(allowedTrips.map(x => x.startsWith('data/trips/') ? x : 'data/trips/' + x + '.json'));
  return changedFiles.filter(path => TRIP_PATH.test(path) && !allowed.has(path))
    .map(path => ({ path, message: 'JSON de viaje modificado fuera del alcance declarado' }));
}



test('edición aislada acepta su viaje, scripts y documentación, no otros JSON', () => {
  const files = ['data/trips/alpha.json', 'components/trip.js', 'docs/trip-editorial-guide.md'];
  assert.deepEqual(checkTripScope(files, ['alpha']), []);
  assert.deepEqual(checkTripScope([...files, 'data/trips/beta.json'],
    ['alpha']).map(x => x.path), ['data/trips/beta.json']);
});
test('edición de varios viajes es legítima cuando se declara explícitamente su alcance', () => {
  const files = ['data/trips/alpha.json', 'data/trips/beta.json'];
  assert.deepEqual(checkTripScope(files, ['alpha', 'beta']), []);
  assert.deepEqual(checkTripScope(files, ['data/trips/alpha.json']).length, 1);
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
