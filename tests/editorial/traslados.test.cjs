'use strict';
const {suite,relationErrors,problem}=require('./section.cjs');
const check=(t,c)=>{
 const errors=relationErrors(t,['majorTransport'],c);
 for(const [i,item] of (Array.isArray(t.majorTransport)?t.majorTransport:[]).entries()){
   for(const [j,option] of (Array.isArray(item?.options)?item.options:[]).entries()){
     for(const [k,journey] of (Array.isArray(option?.journeys)?option.journeys:[]).entries()){
       const p='majorTransport['+i+'].options['+j+'].journeys['+k+']';
       if(!Array.isArray(journey?.segments)||!journey.segments.length){errors.push(problem(p,'Sin segmentos'));continue;}
       for(let n=1;n<journey.segments.length;n++) if(journey.segments[n-1]?.to!==journey.segments[n]?.from)errors.push(problem(p,'Conexión inconexa'));
     }
   }
 }
 return errors;
};
suite('Traslados',check,{majorTransport:[{id:'tren',options:[{journeys:[{segments:[{from:'A',to:'B'},{from:'B',to:'C'}]}]}]}]},[
 {majorTransport:[{id:'tren'},{id:'tren'}]},
 {majorTransport:[{id:'tren',options:[{journeys:[{segments:[]}]}]}]},
 {majorTransport:[{id:'tren',options:[{journeys:[{segments:[{from:'A',to:'B'},{from:'C',to:'D'}]}]}]}]}
]);
