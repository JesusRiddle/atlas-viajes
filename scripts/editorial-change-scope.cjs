'use strict';
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
module.exports = { checkTripScope };
