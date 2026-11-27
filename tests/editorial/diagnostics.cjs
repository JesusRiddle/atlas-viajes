'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {trips,mode}=require('./catalog.cjs');
// Rules with existing debt are visible diagnostics during transition.
// Explicit closure is strict. No permanent per-trip allowlist.
function diagnosticSuite(name,check,valid,invalid){
 test(name+': diagnóstico de transición',t=>{
   const issues=[];
   for(const {module,trip} of trips) for(const e of check(trip)) issues.push({trip:module.id,...e});
   for(const e of issues)t.diagnostic(JSON.stringify(e));
   t.diagnostic('Hallazgos: '+issues.length+'; alcance: '+trips.length);
   if(mode!=='incremental')assert.deepEqual(issues,[]);
 });
 test(name+': control positivo y negativos',()=>{
   assert.deepEqual(check(valid),[]);
   for(const item of invalid)assert.ok(check(item).length,JSON.stringify(item));
 });
}
module.exports={diagnosticSuite};
