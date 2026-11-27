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

function parseAllowedTrips(value) {
  assert.equal(typeof value,'string','Declarar alcance explícito (vacío si no hay viajes autorizados)');
  if(value==='')return [];
  const ids=value.split(',').map(s=>s.trim());
  assert.ok(ids.every(s=>/^(?:[a-z0-9]+(?:-[a-z0-9]+)*|_template)$/.test(s)),'Alcance inválido');
  assert.equal(new Set(ids).size,ids.length,'Alcance duplicado');
  return ids;
}
test('declaración de alcance estricta: no acepta entradas vacías ni duplicados',()=>{
 assert.deepEqual(parseAllowedTrips(''),[]);
 assert.deepEqual(parseAllowedTrips('alpha, beta'),['alpha','beta']);
 assert.deepEqual(parseAllowedTrips('_template'),['_template']);
 for(const bad of [undefined,' ', 'alpha,', ',alpha','alpha,,beta','alpha,alpha','alpha\nbeta'])assert.throws(()=>parseAllowedTrips(bad));
});

// A real git comparison, including deletions and both sides of renames.
test('alcance del diff real declarado por CI', t => {
 const base=process.env.ATLAS_SCOPE_BASE;
 if(!base){t.skip('Sin base de alcance explícita; ejecutar mediante CI o ATLAS_SCOPE_BASE');return;}
 assert.match(base,/^[a-f0-9]{40}$/i);
 const {execFileSync}=require('node:child_process');
 const changed=execFileSync('git',['diff','--no-renames','--name-only','-z',base,'HEAD'],{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).split('\0').filter(Boolean);
 const allowed=parseAllowedTrips(process.env.ATLAS_SCOPE_TRIPS);
 assert.deepEqual(checkTripScope(changed,allowed),[]);
 t.diagnostic('Archivos comparados: '+changed.length+'; viajes autorizados: '+allowed.join(','));
});
