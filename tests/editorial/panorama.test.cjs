'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { trips, closes } = require('./catalog.cjs');
const { indicators } = require('./temperature-contracts.cjs');
function check(trip, complete=false) {
  const errors=indicators(trip.practicalIndicators ?? [],{complete});
  for(const key of ['intro','introShort','climate']){
    const value=trip[key];
    if((value!=null&&typeof value!=='string')||(complete&&!(typeof value==='string'&&value.trim())))
      errors.push({path:key,message:'Texto editorial requerido al cierre o tipo incorrecto'});
  }
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
  const full={practicalIndicators:items,intro:'Visitar Puerto',introShort:'Descubrir Puerto',climate:'Templado.\n\n*Qué llevar:* Abrigo.\n\n*Horas de luz:* Día largo.'};
  assert.deepEqual(check(full,true),[]);
  for(const key of ['intro','introShort','climate'])assert.ok(check({...full,[key]:null},true).some(e=>e.path===key));
  assert.ok(check({intro:42}).some(e=>e.path==='intro'));
  assert.ok(check({practicalIndicators:[items[1],items[0],items[2]]}).length);
  for(const change of [{badge:'Italiano · XYZ'},{tone:'orange'}])
    assert.ok(check({practicalIndicators:items.map(i=>i.id==='language'?{...i,...change}:i)}).length);
});

test('Indicadores: múltiples monedas y texto obligatorio',()=>{
 const items=[{id:'style',title:'Estilo de viaje',text:'Caminar',badge:'Flexible',tone:'green'},{id:'language',title:'Idioma y moneda',text:'Tarjetas',badge:'Alemán · CHF; italiano · EUR',tone:'green'},{id:'entry',title:'Documentación y consejos prácticos',text:'Pasaporte',badge:'Revisar',tone:'orange'}];
 assert.deepEqual(indicators(items),[]);assert.ok(indicators(items.map(x=>x.id==='entry'?{...x,badge:''}:x)).length);
});
