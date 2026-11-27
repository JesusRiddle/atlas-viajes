'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {runtime,plain,money,transport}=require('./runtime.cjs');
const setup=()=>runtime(['components/selections.js','components/budget.js']);
test('Conversión MXN, divisas, cero real y pago registrado',()=>{
 const b=setup().AtlasBudget;
 for(const [cost,rates,paid,expected] of [[money(10,'EUR'),{EUR:20},null,200],[money(12,'CHF'),{CHF:22},null,264],[money(0),{},null,0],[money(5,'EUR'),{},null,null],[money(5,'EUR'),{EUR:0},null,null],[money(-1),{},null,null],[null,{},null,null],[money(9,'EUR'),{},145.25,145.25],[money(9,'EUR'),{},0,0]])assert.equal(b.convert(cost,rates,paid),expected);
});
test('Selección recalcula solo tarifa activa, excluye pase cubierto y opcionales',()=>{
 const {AtlasBudget:b,AtlasSelections:s}=setup();
 const t={id:'sample',travelerCount:3,exchangeRates:{EUR:20},majorTransport:[transport(),{...transport('feeder'),budgetIncludedIn:'rail'}],expenses:[{id:'meal',cost:money(100)},{id:'optional',optional:true,cost:money(900)}]};
 const before=structuredClone(t);
 assert.equal(b.summary(t).knownTotalMXN,300);
 assert.equal(b.summary(t).entries.length,2);
 s.set(t,'rail','a','flex');
 assert.equal(b.currentSummary(t).knownTotalMXN,400);
 s.set(t,'rail','b','basic');
 assert.equal(b.currentSummary(t).knownTotalMXN,500);
 s.reset(t.id);
 assert.equal(b.currentSummary(t).knownTotalMXN,300);
 assert.deepEqual(t,before);
});
test('Distribución de centavos y pagos parciales conserva total sin duplicar noches',()=>{
 const b=setup().AtlasBudget;
 const days=['2027-01-01','2027-01-02','2027-01-03'].map((date,i)=>({date,n:i+1}));
 const t={days,hotels:[{id:'h'}],expenses:[
 {id:'advance',hotelId:'h',category:'lodging',date:days[0].date,nights:3,cost:money(100)},
 {id:'balance',hotelId:'h',category:'lodging',date:days[0].date,nights:3,cost:money(50.01)},
 {id:'unknown',date:days[1].date,cost:money(8,'EUR')} ]};
 const result=b.summary(t);
 assert.equal(result.knownTotalMXN,150.01);
 assert.deepEqual(days.map(d=>result.byDay[d.date].totalMXN),[50,50,50.01]);
 assert.equal(result.byCategory.lodging.totalMXN,150.01);
 assert.equal(result.partial,true);
 assert.deepEqual(plain(result.pending),['unknown']);
 assert.equal(result.byDay[days[1].date].partial,true);
});
test('Vuelo redondo global una vez, rango independiente y duplicados señalados',()=>{
 const b=setup().AtlasBudget;
 const f={...transport('air'),type:'flight'};
 const t={majorTransport:[f],exchangeRates:{EUR:20},budgetRange:[1000,2000],days:[{n:1,date:'2027-01-01',transportRefs:['air']},{n:2,date:'2027-01-02',transportRefs:['air']}],expenses:[{id:'food',date:'2027-01-01',cost:money(30)},{id:'food',cost:money(30)}]};
 const x=b.summary(t);
 assert.equal(x.knownTotalMXN,230);
 assert.equal(x.entries.filter(e=>e.id==='air').length,1);
 assert.equal(x.byDay['2027-01-01'].totalMXN,30);
 assert.equal(x.byDay['2027-01-02'].totalMXN,0);
 assert.deepEqual(plain(x.planningRangeMXN),[1000,2000]);
 assert.ok(x.issues.some(s=>s.includes('duplicado')));
});
test('Proyección sustituye vuelo incluido y selecciona un escenario, no ambos',()=>{
 const {AtlasBudget:b,AtlasSelections:s}=setup();
 const flight={...transport('flight-international'),type:'flight',budgetIncludedIn:'air-reference'};
 flight.options[0].id='A';flight.options[1].id='B';flight.selectedOption='A';
 const t={id:'projection',exchangeRates:{EUR:20},majorTransport:[flight],budgetPreliminary:{marginMXN:1000,useBudgetRange:true,referenceFlightMXN:200},budgetRange:[1000,2000],expenses:[{id:'air-reference',cost:money(200)},{id:'land-a',scenario:'tokyo',cost:money(300)},{id:'land-b',scenario:'kix',cost:money(500)}]};
 assert.equal(b.planningEstimate(t).totalMXN,500);
 assert.equal(b.summary(t).knownTotalMXN,500);
 s.set(t,flight.id,'B','basic');
 assert.equal(b.planningEstimate(t).totalMXN,900);
 assert.equal(b.planningEstimate(t).low,1200);
 assert.equal(b.currentSummary(t).knownTotalMXN,900);
 assert.equal(b.summary(t).knownTotalMXN,500,'El cálculo puro conserva selección original');
});

test('Comparación de tarifas, multiplicador y asignación diaria sin afectar otros gastos',()=>{
 const {AtlasBudget:b,AtlasSelections:s}=setup();
 const rail=transport();rail.options[1].priceMultiplier=2;
 const t={id:'sample',exchangeRates:{EUR:20},majorTransport:[rail],days:[
 {n:1,date:'2027-01-01',transportRefs:['rail']},{n:2,date:'2027-01-02'}],
 expenses:[{id:'meal',date:'2027-01-02',cost:money(80)}]};
 assert.deepEqual(plain(b.transportComparison(rail,t.exchangeRates)).map(x=>x.mxn),[200,300,800]);
 assert.equal(b.currentSummary(t).byDay['2027-01-01'].totalMXN,200);
 s.set(t,'rail','b','basic');
 const result=b.currentSummary(t);
 assert.equal(result.byDay['2027-01-01'].totalMXN,800);
 assert.equal(result.byDay['2027-01-02'].totalMXN,80);
 assert.equal(result.knownTotalMXN,880);
 assert.equal(result.partial,false);
});
test('Calendario de gastos, migración pendiente y fechas fuera del viaje',()=>{
 const b=setup().AtlasBudget;
 assert.deepEqual(plain(b.nightsByDate('2028-02-28',3)),['2028-02-28','2028-02-29','2028-03-01']);
 assert.deepEqual(plain(b.nightsByDate('2028-02-28',0)),[]);
 assert.deepEqual(plain(b.expenseDates({dates:['2027-01-01','2027-01-01','2027-01-02']})),['2027-01-01','2027-01-02']);
 const t={days:[{date:'2027-01-01'}],hotels:[{id:'h'}],expenses:[{id:'e',date:'2027-01-02',cost:money(100)}]};
 const result=b.summary(t);
 assert.equal(result.knownTotalMXN,100);
 assert.equal(result.byDay['2027-01-01'].totalMXN,0);
 assert.equal(result.migrationPending,true);
 assert.equal(result.partial,true);
 assert.ok(result.issues.some(x=>x.includes('Fecha fuera')));
});
