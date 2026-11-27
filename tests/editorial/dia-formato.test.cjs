'use strict';
const {diagnosticSuite}=require('./diagnostics.cjs');
const {problem}=require('./section.cjs');
function check(t){
 const errors=[];
 for(const d of Array.isArray(t.days)?t.days:[])for(const field of ['mobility','note']){
   const value=d?.[field];
   if(typeof value!=='string'||!value.trim())continue;
   if(!value.split(/\r?\n/).filter(l=>l.trim()).every(l=>/^• \*[^*\n]+:\*\s+\S/.test(l)))
     errors.push({...problem('days.'+d.date+'.'+field,'Formato de indicaciones: • *Título:* Texto'),evidence:value});
 }
 return errors;
}
diagnosticSuite('Día por día: formato editorial',check,{days:[{date:'2027-01-01',note:'• *Consejo:* Llevar agua.'}]},[
 {days:[{date:'2027-01-01',note:'Consejo: Llevar agua.'}]},
 {days:[{date:'2027-01-01',mobility:'• *Metro*: Comprar boleto.'}]}
]);
