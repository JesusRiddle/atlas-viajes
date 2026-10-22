const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('paso 16: dos flujos de creación sin sobrescribir el original', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-test-'));
  try {
    fs.mkdirSync(path.join(root, 'scripts'));
    fs.mkdirSync(path.join(root, 'data', 'trips'), {recursive:true});
    fs.copyFileSync('scripts/new-trip.cjs', path.join(root,'scripts','new-trip.cjs'));
    fs.writeFileSync(path.join(root,'modules.js'), 'window.ATLAS_MODULES = [{ "id": "antiguo", "file": "antiguo.json", "available": true }];');
    const original = {id:'antiguo',name:'Viejo',routeCities:['Roma'],experiences:['Visita'],start:'2026-10-01',costs:[['Hotel',100,200]]};
    const src = path.join(root,'data','trips','antiguo.json');
    fs.writeFileSync(src, JSON.stringify(original));
    const run = args => spawnSync(process.execPath,[path.join(root,'scripts','new-trip.cjs'),...args],{cwd:root,encoding:'utf8'});
    assert.equal(run(['nuevo','Nuevo']).status,0);
    assert.equal(run(['copia','Copia','--from','antiguo']).status,0);
    const fresh = JSON.parse(fs.readFileSync(path.join(root,'data','trips','nuevo.json')));
    const based = JSON.parse(fs.readFileSync(path.join(root,'data','trips','copia.json')));
    assert.deepEqual(fresh,{id:'nuevo',name:'Nuevo',status:'draft'});
    assert.deepEqual(based.routeCities,['Roma']);
    assert.deepEqual(based.experiences,['Visita']);
    assert.equal(based.start,undefined);
    assert.equal(based.costs,undefined);
    assert.equal(fs.readFileSync(src,'utf8'),JSON.stringify(original));
    assert.equal(run(['nuevo','Duplicado']).status,1);
    const modules = fs.readFileSync(path.join(root,'modules.js'),'utf8');
    assert.match(modules, /"id": "copia"/);
    assert.match(modules, /"available": false/);
  } finally { fs.rmSync(root,{recursive:true,force:true}); }
});
