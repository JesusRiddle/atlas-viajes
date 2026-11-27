'use strict';
const {diagnosticSuite,newIssues}=require('./diagnostics.cjs');
const test=require('node:test');
const assert=require('node:assert/strict');
const {problem}=require('./section.cjs');
function check(t){
 const errors=[];
 for(const [i,d] of (Array.isArray(t.days)?t.days:[]).entries())for(const field of ['mobility','note']){
   const value=d?.[field];
   if(typeof value!=='string'||!value.trim())continue;
   if(!value.split(/\r?\n/).filter(l=>l.trim()).every(l=>/^• \*[^*\n]+:\*\s+\S/.test(l)))
     errors.push({...problem('days.'+d.date+'.'+field,'Formato de indicaciones: • *Título:* Texto'),evidence:value,identity:['day',d?.n??i+1,field]});
 }
 return errors;
}
diagnosticSuite('Día por día: formato editorial',check,{days:[{date:'2027-01-01',note:'• *Consejo:* Llevar agua.'}]},[
 {days:[{date:'2027-01-01',note:'Consejo: Llevar agua.'}]},
 {days:[{date:'2027-01-01',mobility:'• *Metro*: Comprar boleto.'}]}
]);

test('Reprogramar fechas no crea deuda; editar o multiplicar incumplimientos sí',()=>{
 const before={days:[{n:1,date:'2027-01-01',note:'Texto heredado'}]};
 const after=structuredClone(before);after.days[0].date='2027-03-01';
 assert.deepEqual(newIssues(check(after),check(before)),[]);
 after.days[0].note='Otro texto incorrecto';
 assert.equal(newIssues(check(after),check(before)).length,1);
 after.days[0].note=before.days[0].note;
 after.days.push({n:2,date:'2027-03-02',note:before.days[0].note});
 assert.equal(newIssues(check(after),check(before)).length,1);
 after.days[0].note='• *Consejo:* Llevar agua.';
 assert.equal(newIssues(check(after),check(before)).length,1);
});
