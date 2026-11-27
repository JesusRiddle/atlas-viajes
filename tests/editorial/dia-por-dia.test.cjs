'use strict';
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
