'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {trips,closes,mode}=require('./catalog.cjs');
const {validate,photos}=require('../../scripts/editorial-relations.cjs');
const {read}=require('./catalog.cjs');
// Transitional reuse: each issue belongs to one section. Replace the monolith only after equivalence.
function relationErrors(trip,roots,complete=false){
 return validate(trip,{complete}).filter(e=>roots.some(k=>e.path===k||e.path.startsWith(k+'.')||e.path.startsWith(k+'[')));
}
function suite(name,check,valid,invalid,extra={}){
 test(name+': contratos de los viajes seleccionados',t=>{
   for(const {module,trip} of trips) {
     const errors=check(trip,closes(extra.section || ({Mapa:'mapa',Experiencias:'experiencias',Reservaciones:'reservas',Traslados:'traslados',Alojamientos:'alojamientos','Día por día':'dias',Presupuesto:'costes'})[name]),mode);
     assert.deepEqual(errors,[],module.id+': '+JSON.stringify(errors));
   }
   if(!trips.length)t.diagnostic('Sin viajes seleccionados; solo fixtures');
 });
 test(name+': ejemplo válido y contraejemplos independientes',()=>{
   assert.deepEqual(check(valid,false),[]);
   for(const bad of invalid)assert.ok(check(bad,false).length,JSON.stringify(bad));
   if(extra.complete) assert.ok(check({},true).length);
 });
}
const problem=(path,message)=>({path,message});
module.exports={suite,relationErrors,problem,photos,read};
