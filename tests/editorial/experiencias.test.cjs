'use strict';
const {suite,relationErrors,problem}=require('./section.cjs');
function check(t,c){
 const errors=relationErrors(t,['experiences'],c);
 if(c&&(!Array.isArray(t.experiences)||!t.experiences.length))errors.push(problem('experiences','Experiencias pendientes de definir'));
 return errors;
}
suite('Experiencias',check,{experiences:[{city:'Puerto',description:'Recorrer el mercado y probar especialidades locales.'}]},[
 {experiences:[{city:'',description:'Visita'}]},
 {experiences:[{city:'Puerto',description:''}]},
 {experiences:'texto'}
],{complete:true});
