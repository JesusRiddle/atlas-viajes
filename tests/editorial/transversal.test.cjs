'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { modules, all, primary, trips, mode, selected, validateModules } = require('./catalog.cjs');
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
