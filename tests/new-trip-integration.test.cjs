const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const vm = require('node:vm');

test('paso 17: alta real desde cero, edición gradual y normalización, sin tocar viajes antiguos', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-integration-'));
  try {
    fs.mkdirSync(path.join(root,'scripts'));
    fs.mkdirSync(path.join(root,'data','trips'),{recursive:true});
    fs.copyFileSync('scripts/new-trip.cjs',path.join(root,'scripts','new-trip.cjs'));
    fs.copyFileSync('loader.js',path.join(root,'loader.js'));
    fs.copyFileSync('data/trips/_template.json',path.join(root,'data','trips','_template.json'));
    fs.writeFileSync(path.join(root,'modules.js'),'window.ATLAS_MODULES = [];\n');
    const run = spawnSync(process.execPath,[path.join(root,'scripts','new-trip.cjs'),'viaje-prueba','Viaje de prueba'],{encoding:'utf8'});
    assert.equal(run.status,0,run.stderr);
    const file = path.join(root,'data','trips','viaje-prueba.json');
    const draft = JSON.parse(fs.readFileSync(file,'utf8'));
    assert.deepEqual(draft,{id:'viaje-prueba',name:'Viaje de prueba',status:'draft'});
    assert.match(fs.readFileSync(path.join(root,'modules.js'),'utf8'),/"available": false/);
    const source = {...draft,routeCities:['Destino de prueba'],days:[{n:1,title:'Llegada'}],
      experiences:['Paseo sin reserva'],costs:[['Transporte',null,null]],
      seasonality:{months:{'02':{status:'recommended',description:'Valoración de prueba'}}}};
    fs.writeFileSync(file,JSON.stringify(source,null,2));
    const registry = [{id:'viaje-prueba',file:'viaje-prueba.json',available:true}];
    const window = {ATLAS_MODULES:registry};
    const urls={'data/places.json':{},'data/trips/_template.json':JSON.parse(fs.readFileSync(path.join(root,'data','trips','_template.json'))),'data/trips/viaje-prueba.json':source};
    const fetch=async url=>({ok:Object.hasOwn(urls,url),status:404,json:async()=>urls[url]});
    vm.runInNewContext(fs.readFileSync('loader.js','utf8'),{window,fetch});
    const normalized=(await window.ATLAS_READY).trips[0];
    assert.equal(normalized.days.length,1);
    assert.equal(normalized.costs[0][1],null);
    assert.equal(normalized.seasonality.months['01'].status,'pending');
    assert.equal(normalized.seasonality.months['02'].status,'recommended');
    assert.equal(normalized.hotels.length,0);
    assert.equal(normalized.majorTransport.length,0);
    assert.deepEqual(JSON.parse(fs.readFileSync(file,'utf8')),source);
  } finally {fs.rmSync(root,{recursive:true,force:true});}
});
