'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {trips,closes,mode}=require('./catalog.cjs');
const contracts=require('./contracts.cjs');
const {photos,dateOK}=contracts;
const {read}=require('./catalog.cjs');
// Dispatch only the section being audited; no cross-section filtering of a monolithic validator.
function relationErrors(trip,roots,complete=false){
 // The previous validator requires the last known day to equal end even in incremental mode.
// A consecutive prefix is valid; the final date is mandatory only at closure.
 const input=!complete&&Array.isArray(trip.days)&&trip.days.length&&dateOK(trip.end)&&dateOK(trip.days.at(-1)?.date)&&trip.days.at(-1).date<trip.end&&(!trip.start||trip.start<=trip.end)
   ? {...trip,end:null} : trip;
 const key=({experiences:'experiences',majorTransport:'transport',hotels:'lodging',mapPoints:'map',start:'calendar',expenses:'budget',reservations:'reservations'})[roots[0]];
 assert.ok(key,'Contrato sin sección: '+roots[0]);
 return contracts[key](input,complete);
}
function suite(name,check,valid,invalid,extra={}){
 test(name+': contratos de los viajes seleccionados',t=>{
   const section=extra.section || ({Mapa:'mapa',Experiencias:'experiencias',Reservaciones:'reservas',Traslados:'traslados',Alojamientos:'alojamientos','Día por día':'dias',Presupuesto:'costes'})[name];
   assert.ok(section,'Sección no registrada: '+name);
   const failures=[];
   for(const {module,trip} of trips) {
     for(const error of check(trip,closes(section),mode))failures.push({trip:module.id,...error});
   }
   assert.deepEqual(failures,[],name+': '+JSON.stringify(failures));
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
