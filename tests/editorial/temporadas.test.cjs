'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { trips, closes } = require('./catalog.cjs');
const { seasons, temperature, MONTHS } = require('./temperature-contracts.cjs');
function check(value,complete=false) {
  if(value==null && !complete) return [];
  if(!value || typeof value!=='object' || Array.isArray(value)) return [{path:'seasonality',message:'Objeto requerido'}];
  const pending=Object.fromEntries(MONTHS.map(m=>[m,{status:'pending',description:null}]));
  if(value.months!=null && (typeof value.months!=='object'||Array.isArray(value.months))) return [{path:'seasonality.months',message:'Objeto requerido'}];
  const months=complete?value.months:{...pending,...value.months};
  const errors=seasons({months});
  for(const [key,item] of Object.entries(months||{})) {
    if(item && item.description!==null && typeof item.description!=='string') errors.push({path:'seasonality.months.'+key,message:'Descripción inválida'});
    if(complete && item?.status==='pending') errors.push({path:'seasonality.months.'+key,message:'Investigación pendiente'});
  }
  return errors;
}
test('Temporadas: meses informados válidos',()=>{
  for(const {module,trip} of trips) assert.deepEqual(check(trip.seasonality,closes('temporadas')),[],module.id);
});
test('Temporadas: parcial, cierre, signo y significado',()=>{
  const months=Object.fromEntries(MONTHS.map(m=>[m,{status:'pending',description:null}]));
  assert.deepEqual(check({months:{'01':months['01']}}),[]);
  assert.ok(check({months},true).length);
  assert.deepEqual(check({months}),[]);
  months['01']={status:'recommended',description:'Máx. 5 °C · Mín. −3 °C'};
  months['02']={status:'conditional',description:'Máximas entre regiones: −3 a 5 °C'};
  assert.deepEqual(check({months}),[]);
  assert.equal(temperature(months['02'].description).kind,'legacy-interval');
  months['01'].description='Máx. −3 °C · Mín. 5 °C';
  assert.ok(check({months}).some(e=>e.path.endsWith('01')));
  delete months['12'];
  assert.ok(check({months},true).some(e=>e.path.endsWith('12')));
});

test('temperatura explícita: máxima izquierda, mínima derecha y negativos correctos', () => {
  for (const [source, max, min] of [
    ['Máx. 5 °C · Mín. −3 °C', 5, -3],
    ['Máx. −1 °C · Mín. −12 °C', -1, -12],
    ['Máx. 0 °C · Mín. 0 °C', 0, 0],
    ['Máx. 18,5 °C · Mín. 11,2 °C', 18.5, 11.2]
  ]) assert.deepEqual(temperature(source), { kind: 'explicit', max, min, errors: [] });
  assert.match(temperature('Máx. −3 °C · Mín. 5 °C').errors.join(' '), /máxima/);
  assert.match(temperature('Máx. -1 °C · Mín. -3 °C').errors.join(' '), /Unicode/);
  assert.equal(temperature('5 a −3 °C').kind, 'legacy-interval');
  assert.match(temperature('5 a −3 °C').errors.join(' '), /menor a mayor/);
  assert.equal(temperature('5–3 °C').kind, 'invalid');
  assert.equal(temperature('111 a 2 °C').kind, 'invalid',
    'No aceptar un fragmento numérico dentro de otro valor');
  assert.deepEqual(temperature('Máx. 5 °C · Mín. −3 °C.'),
    { kind: 'explicit', max: 5, min: -3, errors: [] });
  assert.match(temperature('Máx. 5 °C Mín. −3 °C').errors.join(' '), /malformado/);
  assert.match(temperature('Máx. 5 °C · Mín. −3 °C10').errors.join(' '), /malformado/);
});

test('intervalos históricos conservan significado sin inventar mínimos nocturnos', () => {
  assert.deepEqual(temperature('Máximas orientativas: −3 a 5 °C (dos regiones).'),
    { kind: 'legacy-interval', low: -3, high: 5, errors: [] });
  assert.match(temperature('−3 a 5 °C', { allowLegacy: false }).errors.join(' '), /exige/);
  assert.equal(temperature(null).kind, 'missing');
});

