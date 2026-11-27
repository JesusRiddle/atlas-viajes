'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {runtime}=require('./runtime.cjs');
test('Presupuesto estructurado y rangos históricos utilizan el formateador real',()=>{
 const w=runtime(['components/budget.js','components/format.js']);
 const f=w.AtlasFormat({trips:[]});
 assert.equal(f.price({expenses:[{id:'e',cost:{amount:1234.5,currency:'MXN'}}]}),'$1,234.50');
 assert.equal(f.price({budgetRange:[50000,65000]}),'$50,000–$65,000');
 assert.equal(f.esc('<a>&"'), '&lt;a&gt;&amp;&quot;');
 assert.match(f.highlightWords('Puerto y Valle',['Puerto']),/<strong[^>]*>Puerto<\/strong>/);
});
test('Mapa: renderer real, alias, singular, pendiente y excursión',()=>{
 const element={setAttribute(){},addEventListener(){}};
 const w=runtime(['travel-ui.js'],{document:{createElement:()=>element,body:{append(){}}},window:{addEventListener(){}}});
 const html=w.AtlasTravel.mapSection({id:'sample',bases:[['Puerto',1]],mapPoints:[
 {name:'Puerto (centro)',stayName:'Puerto',coords:[1,2],base:true,order:1},
 {name:'Otro',coords:[3,4],base:true,order:2},
 {name:'Valle',coords:[4,5],base:false,order:3},
 {name:'Sin coordenadas',base:false,order:4}]});
 assert.match(html,/1 noche/);assert.match(html,/Noches por definir/);assert.match(html,/Excursión/);
 assert.doesNotMatch(html,/Mostrar Sin coordenadas/);
});


function renderComparison(weather, pace = 'balanced') {
  const trip = {
    id: 'prueba', name: 'Viaje de prueba', start: '2027-01-01', end: '2027-01-03',
    routeCities: ['Ciudad'], days: [{}, {}, {}], bases: [{}], work: 1,
    travelerCount: 1, profile: { weather, pace }
  };
  const window = runtime(['components/home.js'],{window:{AtlasBudget:{planningEstimate:()=>({low:100,high:200})}}});
  const ctx = {
    trips: [trip], photos: {}, main: {}, covers: {}, esc: s => String(s),
    range: () => '1–3 ene 2027', price: () => '$100–$200',
    img: () => '', readable: s => s, highlightWords: s => s,
    familyLabel: () => '', baseLabel: () => '',
    canRenderFullTrip: () => true
  };
  return window.AtlasHome(ctx).comparison();
}

test('la comparativa traduce climas codificados y ritmos', () => {
  const html = renderComparison('winter');
  assert.match(html, />Invernal<\/td>/);
  assert.match(html, />Equilibrado<\/td>/);
  assert.doesNotMatch(html, />winter<\/td>/);
});

test('el clima ausente tiene una etiqueta legible', () => {
  assert.match(renderComparison(undefined), />Por definir<\/td>/);
});

test('la cabecera conserva ocho columnas, sin fusionar Alojamientos y Ritmo', () => {
  const html = renderComparison('Variable');
  const head = html.match(/<thead>(.*?)<\/thead>/)?.[1] || '';
  assert.equal((head.match(/<th /g) || []).length, 8);
  assert.match(head, /<th scope="col">Alojamientos<\/th><th scope="col">Ritmo<\/th>/);
});

test('Render completo acepta presupuesto estructurado y legado, no inventa datos de borrador',()=>{
 const f=runtime(['components/budget.js','components/format.js']).AtlasFormat({trips:[]});
 const t={id:'sample',cover:'fixture',start:'2027-01-01',end:'2027-01-02',intro:'Viaje',climate:'Templado',solo:'Sí',flight:'Pendiente',local:'Tren',days:[{n:1,date:'2027-01-01',places:[]}],bases:[['Puerto',1]],routeCities:['Puerto'],work:0,profile:{pace:'balanced',solo:true,weather:'mild'}};
 assert.equal(f.canRenderFullTrip({...t,expenses:[{id:'e',cost:{amount:50,currency:'MXN'}}]}),true);
 assert.equal(f.canRenderFullTrip({...t,budgetRange:[50,100]}),true);
 assert.equal(f.canRenderFullTrip({id:'draft',name:'Nuevo'}),false);
});

const pending=()=>({months:Object.fromEntries(Array.from({length:12},(_,i)=>[String(i+1).padStart(2,'0'),{status:'pending',description:null}]))});
test('Temporadas presenta rangos sin atribuir mínimas nocturnas inexistentes', () => {
  const window=runtime(['components/seasonality.js']);
  const data = pending();
  data.months['01'] = { status: 'recommended', description: 'Máximas diurnas orientativas: −3 a 5 °C entre regiones.' };
  data.months['02'] = { status: 'conditional', description: '5 a 12 °C. Temperaturas variables.' };
  data.months['03'] = { status: 'recommended', description: 'Máx. 5 °C · Mín. −3 °C. Días fríos.' };
  const html = window.AtlasSeasonality({ esc: String }).seasonality({ seasonality: data });
  const displayed = [...html.matchAll(/class="season-temperature">([^<]+)</g)].map(m => m[1]);
  assert.equal(displayed.length, 12);
  assert.deepEqual(displayed.slice(0, 4), [
    'Máximas: −3 a 5 °C', 'Intervalo: 5 a 12 °C',
    'Máx. 5 °C · Mín. −3 °C', '—'
  ]);
  assert.ok(!displayed[0].includes('Mín.'), 'No inventar mínimas nocturnas');
  assert.match(html, /Máximas diurnas orientativas: −3 a 5 °C entre regiones\./,
    'El texto original conserva la explicación geográfica');
  assert.match(html, /Temperaturas variables/);
  assert.match(html, /Días fríos/);
});

