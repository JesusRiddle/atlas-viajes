'use strict';
const {suite,relationErrors}=require('./section.cjs');
const check=(t,c)=>relationErrors(t,['mapPoints'],c);
suite('Mapa',check,{mapPoints:[{name:'Puerto',coords:[0,0],order:1}]},[
 {mapPoints:[{coords:[91,0],order:1}]},
 {mapPoints:[{coords:[0,0],order:1},{coords:[1,1],order:1}]},
 {mapPoints:'incorrecto'}
]);
