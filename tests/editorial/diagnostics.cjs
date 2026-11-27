'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const path=require('node:path');
const {trips,closes,parseModules,isPrimary}=require('./catalog.cjs');
const root=path.resolve(__dirname,'../..');
const base=process.env.ATLAS_QA_BASE;
if(base)assert.match(base,/^[a-f0-9]{40}$/i,'ATLAS_QA_BASE debe ser un SHA completo');
const opts={cwd:root,encoding:'utf8',maxBuffer:16*1024*1024};
function priorPrimaryIds(source){
 return new Set(parseModules(source).filter(isPrimary).map(m=>m.id));
}
const priorIds=base?priorPrimaryIds(execFileSync('git',['show',base+':modules.js'],opts)):new Set();
const priorCache=new Map();
function priorTrip(id){
 // Only trips previously within the editorial scope can inherit editorial debt.
 // A previously hidden or historical trip is new to this scope.
 if(!priorIds.has(id))return null;
 if(!priorCache.has(id))priorCache.set(id,JSON.parse(execFileSync('git',['show',base+':data/trips/'+id+'.json'],opts)));
 return priorCache.get(id);
}
function newIssues(current,previous){
 const remaining=new Map();
 const key=e=>JSON.stringify([e.path,e.message,e.evidence]);
 for(const e of previous){const k=key(e);remaining.set(k,(remaining.get(k)||0)+1);}
 return current.filter(e=>{const k=key(e),n=remaining.get(k)||0;if(!n)return true;remaining.set(k,n-1);return false;});
}
function diagnosticSuite(name,check,valid,invalid){
 const section=({Panorama:'plan',Mapa:'mapa','Día por día':'dias',Traslados:'traslados'})[name.split(':')[0]];
 assert.ok(section,'Sección diagnóstica no registrada: '+name);
 test(name+': deuda editorial y regresiones',t=>{
   const issues=[],regressions=[];
   for(const {module,trip} of trips){
     const current=check(trip);
     const previous=base?priorTrip(module.id):null;
     const added=base?newIssues(current,previous?check(previous):[]):[];
     for(const e of current)issues.push({trip:module.id,...e});
     for(const e of added)regressions.push({trip:module.id,...e});
   }
   for(const e of issues)t.diagnostic(JSON.stringify(e));
   t.diagnostic('Hallazgos: '+issues.length+'; regresiones: '+(base?regressions.length:'sin base de comparación')+'; alcance: '+trips.length);
   if(closes(section))assert.deepEqual(issues,[]);
   if(base)assert.deepEqual(regressions,[],'Incumplimientos nuevos o modificados');
 });
 test(name+': control positivo y negativos',()=>{
   assert.deepEqual(check(valid),[]);
   for(const item of invalid)assert.ok(check(item).length,JSON.stringify(item));
 });
}
module.exports={diagnosticSuite,newIssues,priorPrimaryIds};
