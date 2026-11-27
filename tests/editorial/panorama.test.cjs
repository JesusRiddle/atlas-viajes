'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { trips, closes } = require('./catalog.cjs');
const { indicators } = require('../../scripts/editorial-contracts.cjs');
function check(trip, complete=false) {
  const errors=indicators(trip.practicalIndicators ?? [],{complete});
  const lang=Array.isArray(trip.practicalIndicators) && trip.practicalIndicators.find(x=>x?.id==='language');
  if(lang && lang.tone!=='green') errors.push({path:'practicalIndicators.language.tone',message:'Debe ser verde'});
  return errors;
}
test('Panorama: indicadores informados', () => {
  for (const {module,trip} of trips) assert.deepEqual(check(trip,closes('plan')),[],module.id);
});
test('Panorama: pendiente legítimo, orden, color y moneda', () => {
  const items=[
    {id:'style',title:'Estilo de viaje',text:'A pie',badge:'Flexible',tone:'green'},
    {id:'language',title:'Idioma y moneda',text:'Tarjetas y efectivo',badge:'Italiano · EUR',tone:'green'},
    {id:'entry',title:'Documentación y consejos prácticos',text:'Consultar requisitos',badge:'Pasaporte',tone:'orange'}
  ];
  assert.deepEqual(check({}),[]);
  assert.ok(check({},true).length);
  assert.deepEqual(check({practicalIndicators:items},true),[]);
  assert.ok(check({practicalIndicators:[items[1],items[0],items[2]]}).length);
  for(const change of [{badge:'Italiano · XYZ'},{tone:'orange'}])
    assert.ok(check({practicalIndicators:items.map(i=>i.id==='language'?{...i,...change}:i)}).length);
});
