'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {newIssues,priorPrimaryIds}=require('./diagnostics.cjs');
test('Deuda: comparación por campo, evidencia y multiplicidad, no por nombre de destino',()=>{
 const a={path:'days.2027-01-01.note',message:'Formato',evidence:'Texto antiguo'};
 const b={...a,evidence:'Texto nuevo'};
 assert.deepEqual(newIssues([a],[a]),[]);
 assert.deepEqual(newIssues([],[a]),[]);
 assert.deepEqual(newIssues([b],[a]),[b]);
 assert.deepEqual(newIssues([a,a],[a]),[a]);
 assert.deepEqual(newIssues([a],[]),[a]);
 assert.deepEqual(newIssues([a,b],[b,a]),[]);
});

test('Deuda: un viaje histórico u oculto que pasa a principal no hereda exenciones',()=>{
 const registry=[{id:'main-trip',file:'main-trip.json',available:true},{id:'old-trip',file:'old-trip.json',available:true,homeGroup:'ideas'},{id:'hidden-trip',file:'hidden-trip.json',available:false}];
 const ids=priorPrimaryIds('window.ATLAS_MODULES='+JSON.stringify(registry));
 assert.deepEqual([...ids],['main-trip']);
});
