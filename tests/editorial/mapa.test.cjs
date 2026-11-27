'use strict';
const {suite,relationErrors,problem}=require('./section.cjs');
function check(t,c){
 const errors=relationErrors(t,['mapPoints'],c);
 if(c&&(!Array.isArray(t.mapPoints)||!t.mapPoints.length))errors.push(problem('mapPoints','Mapa pendiente de definir'));
 for(const [i,p] of (Array.isArray(t.mapPoints)?t.mapPoints:[]).entries()){
   if(p&&typeof p==='object'&&(c||p.name!=null)&&!(typeof p.name==='string'&&p.name.trim()))errors.push(problem('mapPoints['+i+'].name','Nombre requerido'));
 }
 return errors;
}
suite('Mapa',check,{mapPoints:[{name:'Puerto',coords:[0,0],order:1}]},[
 {mapPoints:[{coords:[91,0],order:1}]},
 {mapPoints:[{coords:[0,0],order:1},{coords:[1,1],order:1}]},
 {mapPoints:'incorrecto'}, {mapPoints:[{name:42}]}
],{complete:true});
