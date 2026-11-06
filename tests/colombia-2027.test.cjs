const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const trip = JSON.parse(fs.readFileSync('data/trips/colombia-2027.json', 'utf8'));
const ctx = vm.createContext({window:{}});
for (const file of ['components/transport-model.js','components/selections.js','components/budget.js']) {
  vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
const model=ctx.window.AtlasTransportModel;
const budget=ctx.window.AtlasBudget;
test('Colombia: itinerario consecutivo, noches y alojamientos sin duplicación',()=>{
  assert.equal(trip.days.length,12);
  assert.equal(trip.travelerCount,1);
  assert.equal(trip.work,8);
  assert.equal(trip.bases.reduce((n,[,v])=>n+v,0),11);
  assert.equal(trip.hotels.length,4);
  assert.equal(trip.stays.length,0,'Hoteles estructurados no deben duplicarse en stays');
  const ids=new Set(trip.hotels.map(h=>h.id));
  const date=new Date('2027-01-15T12:00:00Z');
  for(let i=0;i<12;i++){
    const d=trip.days[i];
    assert.equal(d.n,i+1);
    assert.equal(d.date,date.toISOString().slice(0,10));
    date.setUTCDate(date.getUTCDate()+1);
    assert.ok(typeof d.am==='string' && typeof d.pm==='string' && typeof d.night==='string');
    assert.ok(d.am.length>35 && d.pm.length>35 && d.night.length>35, 'Día '+d.n+' sin contenido operativo suficiente');
    assert.ok(d.am.length<390 && d.pm.length<390 && d.night.length<390, 'Día '+d.n+' excede concisión editorial');
    assert.doesNotMatch(d.am+d.pm+d.night,/\b(?:placeholder|lorem ipsum|undefined)\b/i);
    if (i<11) assert.ok(ids.has(d.hotel),'Sin alojamiento en día '+d.n);
    else assert.equal(d.hotel,undefined);
  }
  for (const h of trip.hotels){
    const nights=(Date.parse(h.checkOut)-Date.parse(h.checkIn))/86400000;
    assert.equal(nights,trip.bases.find(x=>x[0]===h.city)?.[1]);
  }
  assert.match(trip.days[5].note,/robos/);
  assert.match(trip.days[5].note,/chaleco salvavidas/);
  assert.match(trip.days[0].note,/fiebre amarilla/);
  assert.match(trip.planningDetails,/no se modifica la ruta vigente/);
  assert.match(trip.planningDetails,/No trasladar automáticamente esa noche a Cartagena/);
  const medellinText=[trip.days[0],trip.days[1],trip.days[2]].map(d=>d.title+' '+d.am+' '+d.pm+' '+d.night).join(' ');
  for(const term of ['Guatapé','Comuna 13','Plaza Botero','Bolívar','Provenza','Pueblito Paisa']) assert.ok(medellinText.includes(term), 'Falta prioridad Medellín: '+term);
  assert.match(trip.days[1].am,/tour organizado|excursión organizada/);
  assert.match(trip.days[4].am,/finca cafetera|tour del café/i);
  assert.ok(trip.reservations.flatMap(g=>g[1]).some(x=>/Requisitos sanitarios/.test(x.title)));
  assert.ok(trip.hotels.some(h=>h.id==='sm-isabella' && h.links?.some(x=>x.url.includes('kalihotels.com'))));
  assert.doesNotMatch(trip.days.map(d=>d.title+' '+d.am+' '+d.pm).join(' '),/Museo del Oro|San Pedro Alejandrino/);
});
test('Colombia: vuelos válidos, referencias y fechas sin doble contabilizar',()=>{
  assert.deepEqual([...model.validateTrip(trip)],[]);
  assert.deepEqual(trip.majorTransport.map(x=>x.budgetIncludedIn),['air-copa','air-avianca','ground-mobility']);
  const ids=new Set(trip.expenses.map(x=>x.id));
  assert.ok(trip.majorTransport.every(t=>ids.has(t.budgetIncludedIn)));
  assert.equal(budget.summary(trip).issues.length,0);
  assert.equal(budget.summary(trip).pending.length,0);
  assert.equal(budget.summary(trip).knownTotalMXN,46735);
  const estimate=budget.planningEstimate(trip);
  assert.equal(estimate.totalMXN,46735);
  assert.equal(estimate.low,39000);
  assert.equal(estimate.high,61000);
  const backup=budget.planningEstimate({...trip,majorTransport:trip.majorTransport.map(t=>t.id==='flight-international'?{...t,selectedOption:'B'}:t)});
  assert.equal(backup.totalMXN,47378);
  assert.equal(trip.hotels[0].checkIn,'2027-01-15');
  assert.equal(trip.hotels[0].checkOut,'2027-01-18');
  assert.equal(trip.majorTransport[0].options[0].fares[0].price.amount,9076);
  assert.equal(trip.majorTransport[0].options[1].fares[0].price.amount,9719);
  assert.ok(trip.days[8].transportRefs.includes('bus-tayrona-cartagena'));
  assert.equal(trip.majorTransport.find(x=>x.id==='bus-tayrona-cartagena').options.length,2);
});
test('Colombia: temperaturas con fuentes, indicadores y fotografías',()=>{
  assert.equal(Object.keys(trip.seasonality.months).length,12);
  for (const m of Object.values(trip.seasonality.months))
    assert.match(m.description,/\d+ a \d+ °C/);
  assert.deepEqual(trip.practicalIndicators.map(x=>x.id),['style','language','entry']);
  assert.equal(trip.climate.split(/\n\s*\n/).length,3);
  assert.ok(trip.exchangeRates.COP>0);
  const places=JSON.parse(fs.readFileSync('data/places.json','utf8'));
  assert.ok(places[trip.cover]?.photo?.src.startsWith('https://'));
  assert.equal(trip.mapPoints.length,7);
  assert.deepEqual(trip.mapPoints.map(x=>x.order),[1,2,3,4,5,6,7]);
});