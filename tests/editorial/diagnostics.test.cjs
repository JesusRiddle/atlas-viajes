'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {newIssues}=require('./diagnostics.cjs');
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
