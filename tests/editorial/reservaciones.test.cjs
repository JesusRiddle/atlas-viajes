'use strict';
const {suite,relationErrors}=require('./section.cjs');
const check=(t,c)=>relationErrors(t,['reservations'],c);
suite('Reservaciones',check,{reservations:[['Prioridad alta',[{title:'Museo',description:'Entrada',links:[{label:'Oficial',url:'https://example.org/'}]}]]]},[
 {reservations:[['Prioridad alta',[]],['Prioridad alta',[]]]},
 {reservations:[['Prioridad alta',[{title:'Museo',links:[{url:'javascript:alert(1)'}]}]]]},
 {reservations:[['Prioridad alta',[{title:''}]]]}
]);
