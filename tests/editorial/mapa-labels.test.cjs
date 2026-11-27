'use strict';
const {diagnosticSuite}=require('./diagnostics.cjs');
const {problem}=require('./section.cjs');
function check(t){
 const errors=[];
 const bases=Array.isArray(t.bases)?t.bases:[];
 for(const p of Array.isArray(t.mapPoints)?t.mapPoints:[]){
   if(p?.base!==true)continue;
   const name=p.stayName||p.name;
   const matches=bases.filter(b=>Array.isArray(b)&&typeof b[0]==='string'&&b[0].toLocaleLowerCase('es')===String(name).toLocaleLowerCase('es'));
   if(!matches.length)errors.push({...problem('mapPoints','Alojamiento sin referencia exacta: '+name),evidence:[p.name,p.stayName]});
 }
 return errors;
}
diagnosticSuite('Mapa: enlace a alojamiento',check,{bases:[['Puerto',2]],mapPoints:[{base:true,name:'Puerto (centro)',stayName:'Puerto'}]},[
 {bases:[['Puerto',2]],mapPoints:[{base:true,name:'Otro'}]}
]);
