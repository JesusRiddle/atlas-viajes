'use strict';
const {suite,relationErrors,problem}=require('./section.cjs');
const {dateOK}=require('../../scripts/editorial-relations.cjs');
const list=x=>Array.isArray(x)?x:[];
function check(t,c){
 const errors=relationErrors(t,['hotels','bases'],c);
 const assigned=new Map();
 for(const day of list(t.days)){
   if(!day?.hotel)continue;
   if(!assigned.has(day.hotel))assigned.set(day.hotel,[]);
   assigned.get(day.hotel).push(day.date);
 }
 for(const h of list(t.hotels)){
   if(!h||!dateOK(h.checkIn)||!dateOK(h.checkOut))continue;
   const dates=assigned.get(h.id)||[];
   const nights=(Date.parse(h.checkOut)-Date.parse(h.checkIn))/86400000;
   if(dates.length>nights||new Set(dates).size!==dates.length||c&&dates.length&&dates.length!==nights)
     errors.push(problem('hotels.'+h.id,'Noches asignadas inconsistentes'));
 }
 return errors;
}
suite('Alojamientos',check,{hotels:[{id:'h',checkIn:'2027-05-01',checkOut:'2027-05-03',mapsUrl:'https://maps.google.com/',links:[{url:'https://example.org/'}]}]},[
 {hotels:[{id:'h',checkIn:'2027-05-03',checkOut:'2027-05-01'}]},
 {hotels:[{id:'h'},{id:'h'}]},
 {hotels:[{id:'h',mapsUrl:'not-a-url'}]},
 {hotels:[{id:'h',checkIn:'2027-05-01',checkOut:'2027-05-02'}],days:[{hotel:'h',date:'2027-05-01'},{hotel:'h',date:'2027-05-01'}]}
]);
