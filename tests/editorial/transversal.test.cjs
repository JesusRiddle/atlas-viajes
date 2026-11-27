'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { modules, all, primary, trips, mode, selected, validateModules, resolveScope } = require('./catalog.cjs');
test('Catálogo: alcance explícito, identidades y registro válido', t => {
  validateModules(modules);
  t.diagnostic('Disponibles: '+all.length+'; principales: '+primary.length+'; seleccionados: '+trips.length+'; modo: '+mode+'; secciones: '+selected.join(','));
  if (!trips.length) t.diagnostic('Sin viajes principales: solo se comprueban fixtures, no contenido turístico.');
});
test('Catálogo: admite altas, bajas y vacío; rechaza rutas y estados inválidos', () => {
  const item = {id:'ejemplo',file:'ejemplo.json',available:true};
  validateModules([]);
  validateModules([item,{id:'otro',file:'otro.json',available:false,homeGroup:'ideas'}]);
  for (const bad of [{...item,file:'../ejemplo.json'},{...item,available:'true'},{...item,homeGroup:'main'},null])
    assert.throws(()=>validateModules([bad]));
  assert.throws(()=>validateModules([item,item]));
});

test('Alcance: cierre explícito, secciones selectivas y errores de configuración',()=>{
 const fixture=['alpha','beta'].map(id=>({module:{id},trip:{id}}));
 const incremental=resolveScope(fixture);
 assert.equal(incremental.trips.length,2);
 assert.equal(incremental.closes('plan'),false);
 const scoped=resolveScope(fixture,{ATLAS_TRIP_ID:'alpha',ATLAS_QA_MODE:'detailed',ATLAS_QA_SECTIONS:'plan,dias'});
 assert.equal(scoped.trips.length,1);
 assert.equal(scoped.trips[0].trip.id,'alpha');
 assert.equal(scoped.closes('dias'),true);
 assert.equal(scoped.closes('costes'),false);
 for(const env of [{ATLAS_TRIP_ID:''},{ATLAS_TRIP_ID:'missing'},{ATLAS_QA_MODE:''},{ATLAS_QA_MODE:'general'},{ATLAS_QA_SECTIONS:''},{ATLAS_QA_SECTIONS:'plan,plan'},{ATLAS_QA_SECTIONS:'unknown'}])assert.throws(()=>resolveScope(fixture,env));
});
