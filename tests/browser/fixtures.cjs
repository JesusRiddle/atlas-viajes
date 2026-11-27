'use strict';
const {transport,money}=require('../functional/runtime.cjs');
const mainId='browser-complete',draftId='browser-minimal',ideaId='browser-idea';
const photo={src:'https://fixture.invalid/photo.svg',attribution:'Autor de prueba',source:'https://fixture.invalid/source',license:'CC BY'};
const places={museum:{name:'Museo de Puerto',photo},park:{name:'Parque de Puerto',photo}};
const rail=transport('rail');rail.title='Tren regional';rail.day=2;
for(const [i,o] of rail.options.entries()){
 o.provider=i?'Operador B':'Operador A';
 o.journeys=[{direction:'roundtrip',segments:[
 {from:'Puerto',to:'Valle',service:i?'B12':'A12',departure:'2027-01-02T09:00Z',arrival:'2027-01-02T10:00Z'},
 {from:'Valle',to:'Puerto',service:i?'B21':'A21',departure:'2027-01-02T17:00Z',arrival:'2027-01-02T18:00Z'}]}];
}
const flight={id:'air',title:'Vuelo redondo',type:'flight',selectedOption:'a',options:[{id:'a',provider:'Aerolínea de prueba',selectedFare:'basic',fares:[{id:'basic',name:'Básica',price:money(1000)}],journeys:[
 {direction:'outbound',segments:[{from:'AAA',to:'BBB',service:'X101',departure:'2027-01-01T23:00-06:00',arrival:'2027-01-02T08:00+01:00'}]},
 {direction:'return',segments:[{from:'BBB',to:'AAA',service:'X102',departure:'2027-01-03T10:00+01:00',arrival:'2027-01-03T13:00-06:00'}]}
]}]};
const full={id:mainId,name:'Puerto y Valle',start:'2027-01-01',end:'2027-01-03',cover:'museum',coverSlides:['museum','park'],routeCities:['Puerto','Valle'],bases:[['Puerto',1]],work:0,travelerCount:2,profile:{pace:'balanced',solo:'easy',weather:'mild'},intro:'Visitar Puerto y Valle.',introShort:'Museo y parque de Puerto.',introHighlights:['Puerto'],climate:'Clima templado.\n\n*Qué llevar:* Abrigo.\n\n*Horas de luz:* Día largo.',solo:'Viaje sencillo',flight:'Vuelo redondo',local:'Tren regional',budgetPreliminary:false,exchangeRates:{EUR:20},practicalIndicators:[
 {id:'style',title:'Estilo de viaje',text:'Flexible',badge:'Tranquilo',tone:'green'},
 {id:'language',title:'Idioma y moneda',text:'Idioma local',badge:'Español · EUR',tone:'green'},
 {id:'entry',title:'Documentación y consejos prácticos',text:'Consultar requisitos',badge:'Pasaporte',tone:'orange'}],
 seasonality:{summary:'Temporada de prueba',months:Object.fromEntries(Array.from({length:12},(_,i)=>[String(i+1).padStart(2,'0'),{status:i===0?'recommended':'pending',description:i===0?'Máx. 20 °C · Mín. 10 °C':null}]))},
 experiences:[{city:'Puerto',description:'Recorrer el museo y conocer su historia.'}],reservations:[['Prioridad alta',[{title:'Museo',description:'Consultar horarios',links:[{label:'Oficial',url:'https://fixture.invalid/museum'}]}]]],planningDetails:{reservationTitle:'Reservaciones importantes'},
 mapPoints:[{name:'Puerto (centro)',stayName:'Puerto',coords:[1,2],base:true,order:1},{name:'Valle',coords:[2,3],base:false,order:2}],
 hotels:[{id:'h',city:'Puerto',name:'Hotel del Puerto',checkIn:'2027-01-02',checkOut:'2027-01-03',status:'estimated',mapsUrl:'https://maps.google.com/'}],
 majorTransport:[flight,rail],expenses:[{id:'hotel',hotelId:'h',category:'lodging',concept:'Alojamiento',date:'2027-01-02',nights:1,cost:money(300)},{id:'meal',category:'food',concept:'Comida',date:'2027-01-03',cost:money(80)}],
 placeDescriptions:{museum:'Museo dedicado a la historia local.',park:'Parque junto al centro histórico.'},
 days:[{n:1,date:'2027-01-01',base:'En vuelo',title:'Salida: vuelo',places:[],am:'Preparar equipaje',pm:'Traslado',night:'Vuelo',transportRefs:['air']},
 {n:2,date:'2027-01-02',base:'Puerto',title:'Puerto: museo',places:['museum','park'],optionalPlaces:['park'],am:'Museo',pm:'Valle',night:'Descanso',hotel:'h',transportRefs:['air','rail']},
 {n:3,date:'2027-01-03',base:'Puerto',title:'Puerto: regreso',places:[],am:'Salida',pm:'Vuelo',night:'Llegada',transportRefs:['air']}]
};
const draft={id:draftId,name:'Viaje mínimo de prueba'};
const idea={id:ideaId,name:'Idea histórica de prueba',start:'2026-01-01'};
const partial={id:'browser-partial',name:'Viaje parcial de prueba',days:[{...full.days[1],n:1,transportRefs:[],hotel:null},{n:2,title:'Por planear'}],placeDescriptions:full.placeDescriptions};
const records=[full,draft,idea,partial];
const modules=records.map(t=>({id:t.id,file:t.id+'.json',available:true,...(t.id===ideaId?{homeGroup:'ideas'}:{})}));
async function installFixtures(page){
 await page.route('**/modules.js',route=>route.fulfill({contentType:'application/javascript',body:'window.ATLAS_MODULES = '+JSON.stringify(modules)+';'}));
 await page.route('**/data/places.json',route=>route.fulfill({json:places}));
 await page.route('**/data/trips/browser-*.json',route=>{
  const id=new URL(route.request().url()).pathname.split('/').pop().replace(/\.json$/,'');
  const record=records.find(t=>t.id===id);
  return record?route.fulfill({json:record}):route.abort();
 });
}
module.exports={full,draft,idea,partial,modules,installFixtures};
