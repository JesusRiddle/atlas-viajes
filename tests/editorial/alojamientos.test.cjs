'use strict';
const {suite,relationErrors}=require('./section.cjs');
const check=(t,c)=>relationErrors(t,['hotels','bases'],c);
suite('Alojamientos',check,{hotels:[{id:'h',checkIn:'2027-05-01',checkOut:'2027-05-03',mapsUrl:'https://maps.google.com/',links:[{url:'https://example.org/'}]}]},[
 {hotels:[{id:'h',checkIn:'2027-05-03',checkOut:'2027-05-01'}]},
 {hotels:[{id:'h'},{id:'h'}]},
 {hotels:[{id:'h',mapsUrl:'not-a-url'}]}
]);
