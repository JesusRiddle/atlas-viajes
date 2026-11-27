'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {runtime,plain,transport}=require('./runtime.cjs');
test('Selecciones aisladas por viaje, copias defensivas y restablecimiento',()=>{
 const {AtlasSelections:s}=runtime(['components/selections.js']);
 const a={id:'alpha',majorTransport:[transport()]},b={id:'beta',majorTransport:[transport()]};
 const original=structuredClone(a);
 assert.deepEqual(plain(s.get(a.id)),{});
 const returned=s.set(a,'rail','a','flex');
 returned.rail.fare='invalid';
 assert.deepEqual(plain(s.get(a.id)),{rail:{option:'a',fare:'flex'}});
 assert.deepEqual(plain(s.get(b.id)),{});
 s.set(b,'rail','b','basic');
 assert.throws(()=>s.set(a,'rail','b','flex'),/inexistente/);
 assert.equal(s.get(a.id).rail.fare,'flex');
 s.reset(a.id);
 assert.deepEqual(plain(s.get(a.id)),{});
 assert.equal(s.get(b.id).rail.option,'b');
 assert.deepEqual(a,original);
});
test('Suscripción emite cambios y se puede cancelar',()=>{
 const s=runtime(['components/selections.js']).AtlasSelections;
 const t={id:'alpha',majorTransport:[transport()]},events=[];
 const unsubscribe=s.subscribe((id,value)=>events.push([id,plain(value)]));
 s.set(t,'rail','b','basic');s.reset(t.id);unsubscribe();s.set(t,'rail','a','basic');
 assert.deepEqual(events,[['alpha',{rail:{option:'b',fare:'basic'}}],['alpha',{}]]);
 assert.throws(()=>s.subscribe(null),/Listener/);
});
