'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { trips, closes } = require('./catalog.cjs');
const { seasons, temperature, MONTHS } = require('../../scripts/editorial-contracts.cjs');
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
