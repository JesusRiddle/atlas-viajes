'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {runtime,read,plain}=require('./runtime.cjs');
const template=JSON.parse(read('data/trips/_template.json'));
const moduleOf=(id,extra={})=>({id,file:id+'.json',available:true,...extra});
async function load(trips,modules=trips.map(t=>moduleOf(t.id)),extra={}){
 const sources={'data/places.json':{},'data/trips/_template.json':template,...Object.fromEntries(trips.map(t=>['data/trips/'+t.id+'.json',t])),...extra};
 const requests=[];
 const window=runtime(['loader.js'],{window:{ATLAS_MODULES:modules},fetch:async url=>{requests.push(url);return {ok:Object.hasOwn(sources,url),status:404,json:async()=>sources[url]};}});
 return {atlas:plain(await window.ATLAS_READY),requests};
}
test('Carga mínima y convivencia con datos heredados, sin mutación',async()=>{
 const minimal={id:'draft',name:'Nuevo'};
 const existing={id:'historic',name:'Anterior',costs:[['Hotel',100,200]],work:0,routeHighlights:false,travelerCount:2,days:[{n:1,title:'Llegada'}]};
 const raw=structuredClone([minimal,existing]);
 const {atlas,requests}=await load(raw,[moduleOf('draft'),moduleOf('historic',{homeGroup:'ideas'}),moduleOf('hidden',{available:false})]);
 assert.equal(atlas.trips.length,2);
 assert.equal(atlas.trips[0].start,null);
 assert.equal(atlas.trips[0].travelerCount,null);
 assert.equal(atlas.trips[0].seasonality,null);
 assert.deepEqual(atlas.trips[0].days,[]);
 assert.equal(atlas.trips[1].homeGroup,'ideas');
 assert.equal(atlas.trips[1].work,0);
 assert.equal(atlas.trips[1].routeHighlights,false);
 assert.deepEqual(atlas.trips[1].costs,existing.costs);
 assert.ok(!requests.includes('data/trips/hidden.json'));
 assert.deepEqual(raw,[minimal,existing]);
});
test('Normalización parcial conserva cero, falso y temporadas informadas',async()=>{
 const source={id:'partial',name:'Parcial',days:null,profile:{solo:false},work:0,seasonality:{months:{'03':{status:'recommended',description:'10 a 20 °C'}}}};
 const {atlas}=await load([source]);
 const t=atlas.trips[0];
 assert.deepEqual(t.days,[]);
 assert.equal(t.profile.solo,false);
 assert.equal(t.work,0);
 assert.equal(Object.keys(t.seasonality.months).length,12);
 assert.equal(t.seasonality.months['01'].status,'pending');
 assert.equal(t.seasonality.months['03'].description,'10 a 20 °C');
 assert.equal(source.days,null);
});
test('Carga rechaza identidad, registro, contenedores, fechas y viajeros inválidos',async()=>{
 const t={id:'sample',name:'Prueba'};
 for(const [change,pattern] of [[{name:''},/Identidad/],[{days:'texto'},/Campo days/],[{exchangeRates:[]},/exchangeRates/],[{start:'2027-02-30'},/Fecha start/],[{travelerCount:0},/travelerCount/],[{seasonality:{months:{'01':{status:'wrong'}}}},/Temporada/]])
  await assert.rejects(load([{...t,...change}]),pattern);
 await assert.rejects(load([t],[moduleOf(t.id),moduleOf(t.id)]),/duplicado/);
 await assert.rejects(load([t],[moduleOf(t.id,{file:'../sample.json'})]),/Entrada inválida/);
 await assert.rejects(load([],[moduleOf('missing')]),/No se pudo cargar/);
});

test('Carga de catálogo vacío y preservación de estructuras completas',async()=>{
 assert.deepEqual((await load([])).atlas.trips,[]);
 const source={id:'full',name:'Prueba',start:'2028-02-29',end:'2028-03-01',days:[{n:1,date:'2028-02-29',places:['museum']}],mapPoints:[{name:'Museo',coords:[1,2]}],majorTransport:[{id:'rail',options:[]}],expenses:[{id:'e',cost:{amount:0,currency:'MXN'}}],customField:{enabled:false}};
 const {atlas}=await load([source],undefined,{'data/places.json':{museum:{photo:{src:'https://example.org/photo.jpg'}}}});
 for(const [key,value] of Object.entries(source))assert.deepEqual(atlas.trips[0][key],value,key);
 assert.equal(atlas.places.museum.photo.src,'https://example.org/photo.jpg');
});

test('Carga admite stays ausente y rechaza tipo e identidad discrepante',async()=>{
 const t={id:'sample',name:'Prueba'};
 await assert.doesNotReject(load([t]));
 await assert.rejects(load([{...t,stays:'inválido'}]),/Campo stays inválido/);
 await assert.rejects(load([t],[moduleOf('other')],{'data/trips/other.json':t}),/Identidad/);
});
