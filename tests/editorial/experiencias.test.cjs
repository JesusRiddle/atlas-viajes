'use strict';
const {suite,relationErrors}=require('./section.cjs');
const check=(t,c)=>relationErrors(t,['experiences'],c);
suite('Experiencias',check,{experiences:[{city:'Puerto',description:'Recorrer el mercado y probar especialidades locales.'}]},[
 {experiences:[{city:'',description:'Visita'}]},
 {experiences:[{city:'Puerto',description:''}]},
 {experiences:'texto'}
]);
