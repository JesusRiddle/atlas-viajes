'use strict';
const {suite,relationErrors,problem}=require('./section.cjs');
const text=x=>typeof x==='string'&&x.trim().length>0;
function check(t,c){
 const errors=relationErrors(t,['reservations'],c);
 if(t.planningDetails?.reservationTitle!=null&&t.planningDetails.reservationTitle!=='Reservaciones importantes')errors.push(problem('planningDetails.reservationTitle','Título editorial incorrecto'));
 for(const g of Array.isArray(t.reservations)?t.reservations:[])for(const [i,r] of (Array.isArray(g?.[1])?g[1]:[]).entries()){
   if(!r||typeof r!=='object')continue;
   if((c||r.description!=null)&&!text(r.description))errors.push(problem('reservations.'+g[0]+'.'+i+'.description','Descripción requerida'));
   for(const l of Array.isArray(r.links)?r.links:[])if(!text(l?.label))errors.push(problem('reservations.'+g[0]+'.'+i+'.links','Etiqueta requerida'));
 }
 return errors;
}
suite('Reservaciones',check,{reservations:[['Prioridad alta',[{title:'Museo',description:'Entrada',links:[{label:'Oficial',url:'https://example.org/'}]}]]]},[
 {reservations:[['Prioridad alta',[]],['Prioridad alta',[]]]},
 {reservations:[['Prioridad alta',[{title:'Museo',links:[{url:'javascript:alert(1)'}]}]]]},
 {reservations:[['Prioridad alta',[{title:''}]]]},
 {reservations:[['Prioridad alta',[{title:'Museo',description:''}]]]},
 {planningDetails:{reservationTitle:'Reservas críticas'}}
]);
