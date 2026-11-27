'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
function validateModules(modules) {
  assert.ok(Array.isArray(modules), 'modules.js debe contener una lista');
  const ids = new Set();
  for (const m of modules) {
    assert.ok(m && typeof m === 'object' && !Array.isArray(m), 'Módulo inválido');
    assert.ok(typeof m.id === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.id), 'ID inválido');
    assert.ok(!ids.has(m.id), 'ID duplicado: ' + m.id);
    ids.add(m.id);
    assert.equal(m.file, m.id + '.json', 'Archivo inválido: ' + m.id);
    assert.equal(typeof m.available, 'boolean', m.id + ': available');
    assert.ok(m.homeGroup === undefined || m.homeGroup === 'ideas', m.id + ': homeGroup');
  }
}
function parseModules(source) {
  const context={window:{}};
  vm.runInNewContext(source,context);
  const modules=context.window.ATLAS_MODULES;
  validateModules(modules);
  return modules;
}
const isPrimary=m=>m.available&&m.homeGroup!=='ideas';
const modules=parseModules(fs.readFileSync(path.join(root,'modules.js'),'utf8'));
const all = modules.filter(m => m.available).map(module => {
  const trip = read('data/trips/' + module.file);
  assert.equal(trip?.id, module.id);
  assert.ok(typeof trip.name === 'string' && trip.name.trim(), module.id + ': nombre');
  return {module, trip};
});
const primary = all.filter(({module}) => isPrimary(module));
const sections = ['plan','mapa','temporadas','experiencias','reservas','traslados','alojamientos','dias','costes'];
function resolveScope(primary,env={}) {
  const target=env.ATLAS_TRIP_ID;
  const mode=env.ATLAS_QA_MODE ?? 'incremental';
  assert.ok(['incremental','general','detailed'].includes(mode),'ATLAS_QA_MODE inválido');
  assert.ok(mode==='incremental'||target,'El cierre requiere ATLAS_TRIP_ID');
  const trips=target===undefined?primary:primary.filter(({module})=>module.id===target);
  assert.ok(target===undefined||trips.length===1,'Viaje solicitado inexistente, oculto o histórico: '+target);
  const requested=env.ATLAS_QA_SECTIONS;
  const selected=requested===undefined?[...sections]:requested.split(',').map(x=>x.trim());
  assert.ok(selected.length&&selected.every(x=>sections.includes(x))&&new Set(selected).size===selected.length,'ATLAS_QA_SECTIONS inválido');
  const closes=section=>mode!=='incremental'&&selected.includes(section);
  return {trips,mode,selected,closes};
}
const {trips,mode,selected,closes}=resolveScope(primary,process.env);
module.exports={closes,selected,modules,all,primary,trips,mode,read,validateModules,parseModules,isPrimary,resolveScope};
