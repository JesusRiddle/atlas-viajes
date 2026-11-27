'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { trips } = require('./catalog.cjs');
const { indicators } = require('../../scripts/editorial-contracts.cjs');
test('Panorama: indicadores informados con identidad, orden y moneda válidos', () => {
  for (const {module, trip} of trips) {
    assert.deepEqual(indicators(trip.practicalIndicators ?? []), [], module.id);
  }
});
test('Panorama: el borrador admite ausencia, el cierre exige los tres indicadores', () => {
  const items = [
    {id:'style',title:'Estilo de viaje',text:'A pie',badge:'Flexible',tone:'green'},
    {id:'language',title:'Idioma y moneda',text:'Tarjetas y efectivo',badge:'Italiano · EUR',tone:'green'},
    {id:'entry',title:'Documentación y consejos prácticos',text:'Consultar requisitos',badge:'Pasaporte',tone:'green'}
  ];
  assert.deepEqual(indicators([]), []);
  assert.notEqual(indicators([], {complete:true}).length, 0);
  assert.deepEqual(indicators(items, {complete:true}), []);
  assert.notEqual(indicators([items[1],items[0],items[2]]).length, 0);
  assert.notEqual(indicators(items.map(i=>i.id==='language'?{...i,badge:'Italiano · XYZ'}:i)).length, 0);
});
