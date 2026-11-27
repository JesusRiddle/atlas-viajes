'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {suite,relationErrors,photos,read,problem}=require('./section.cjs');
const catalog=read('data/places.json');
function check(t,c,mode='detailed'){
 const errors=[...relationErrors(t,['start','end','days'],c),...photos(t,catalog,{complete:c})];
 for(const d of Array.isArray(t.days)?t.days:[]){
   if(!d||typeof d!=='object')continue;
   for(const key of ['title','am','pm','night','mobility','note']){
     if(d[key]!=null&&typeof d[key]!=='string')errors.push(problem('days.'+d.date+'.'+key,'Texto inválido'));
     if(c&&(mode==='detailed'||key==='title')&&['title','am','pm','night'].includes(key)&&!(typeof d[key]==='string'&&d[key].trim()))errors.push(problem('days.'+d.date+'.'+key,'Bloque requerido'));
   }
 }
 return errors;
}
suite('Día por día',check,{start:'2027-05-01',end:'2027-05-01',days:[{n:1,date:'2027-05-01',places:[]}]},[
 {days:[{date:'2027-02-30'}]},
 {days:[{n:2,date:'2027-05-01'}]},
 {days:[{date:'2027-05-01',transportRefs:['missing']}]},
 {days:[{date:'2027-05-01',places:['__missing_fixture__']}]}
],{complete:true});

test('Calendario parcial: permite prefijo consecutivo y exige final al cierre',()=>{
 const t={start:'2027-05-01',end:'2027-05-03',days:[{n:1,date:'2027-05-01',title:'Llegada',places:[]}]};
 assert.deepEqual(check(t,false),[]);
 assert.ok(check(t,true).some(e=>e.path.endsWith('.date')));
 assert.ok(check({...t,end:'2027-04-30'},false).length);
});
test('Cierre general y detallado: no exige logística inventada',()=>{
 const t={start:'2027-05-01',end:'2027-05-01',days:[{n:1,date:'2027-05-01',title:'Llegada',places:[]}]};
 assert.deepEqual(check(t,true,'general'),[]);
 assert.ok(check(t,true,'detailed').some(e=>e.path.endsWith('.am')));
 const full=structuredClone(t);
 Object.assign(full.days[0],{am:'Llegada',pm:'Paseo',night:'Descanso'});
 assert.deepEqual(check(full,true,'detailed'),[]);
});
