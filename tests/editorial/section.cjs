'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {trips,closes,mode}=require('./catalog.cjs');
const {validate,photos,dateOK}=require('../../scripts/editorial-relations.cjs');
const {read}=require('./catalog.cjs');
// Transitional reuse: each issue belongs to one section. Replace the monolith only after equivalence.
function relationErrors(trip,roots,complete=false){
 // The previous validator requires the last known day to equal end even in incremental mode.
// A consecutive prefix is valid; the final date is mandatory only at closure.
 const input=!complete&&Array.isArray(trip.days)&&trip.days.length&&dateOK(trip.end)&&dateOK(trip.days.at(-1)?.date)&&trip.days.at(-1).date<trip.end&&(!trip.start||trip.start<=trip.end)
   ? {...trip,end:null} : trip;
 return validate(input,{complete}).filter(e=>roots.some(k=>e.path===k||e.path.startsWith(k+'.')||e.path.startsWith(k+'[')));
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
