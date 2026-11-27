'use strict';
const {suite,relationErrors,problem}=require('./section.cjs');
function check(t,c){
 const errors=relationErrors(t,['expenses','exchangeRates','exchangeRateSnapshot','travelerCount'],c);
 const items=Array.isArray(t.majorTransport)?t.majorTransport:[];
 const rows=Array.isArray(t.expenses)?t.expenses:[];
 const hotels=new Map((Array.isArray(t.hotels)?t.hotels:[]).filter(Boolean).map(h=>[h.id,h]));
 for(const e of rows){
   if(!e||typeof e!=='object')continue;
   if(e.nights!=null&&(!Number.isInteger(e.nights)||e.nights<1))errors.push(problem('expenses.'+e.id+'.nights','Noches inválidas'));
   const h=hotels.get(e.hotelId);
   if(h&&Number.isInteger(e.nights)&&e.nights>0){
     const nights=(Date.parse(h.checkOut)-Date.parse(h.checkIn))/86400000;
     if(Number.isFinite(nights)&&e.nights>nights)errors.push(problem('expenses.'+e.id+'.nights','Noches superiores a la estancia'));
   }
 }
 // Installments can repeat coverage or omit nights; don't sum overlapping night counts.
 // A single explicitly partial payment is also valid; reconciliation of amounts belongs to functional tests.
 const expenses=new Set((Array.isArray(t.expenses)?t.expenses:[]).map(e=>e?.id));
 const byId=new Map(items.map(x=>[x?.id,x]));
 for(const item of items){
   if(!item?.budgetIncludedIn)continue;
   const visited=new Set([item.id]);let ref=item.budgetIncludedIn;
   while(ref){
     if(expenses.has(ref))break;
     if(visited.has(ref)||!byId.has(ref)){errors.push(problem('majorTransport.'+item.id+'.budgetIncludedIn','Ciclo o referencia huérfana'));break;}
     visited.add(ref);
     const parent=byId.get(ref);ref=parent.budgetIncludedIn;
     if(!ref && !(Array.isArray(parent.options)&&parent.options.some(o=>Array.isArray(o?.fares)&&o.fares.length)))errors.push(problem('majorTransport.'+item.id+'.budgetIncludedIn','Agrupador sin tarifa'));
   }
 }
 return errors;
}
suite('Presupuesto',check,{travelerCount:1,expenses:[{id:'e',cost:{amount:0,currency:'MXN'}}],majorTransport:[{id:'t',budgetIncludedIn:'e'}]},[
 {travelerCount:0},
 {expenses:[{id:'e',nights:0}]},
 {hotels:[{id:'h',checkIn:'2027-01-01',checkOut:'2027-01-03'}],expenses:[{id:'e',hotelId:'h',nights:3}]},
 {expenses:[{id:'e',cost:{amount:-1,currency:'MXN'}}]},
 {exchangeRates:{EUR:0}},
 {majorTransport:[{id:'t',budgetIncludedIn:'missing'}]},
 {majorTransport:[{id:'t',budgetIncludedIn:'t'}]}
],{complete:true});

const test=require('node:test');
const assert=require('node:assert/strict');
test('Presupuesto: pagos parciales, anticipos y cobertura repetida legítimos',()=>{
 const hotels=[{id:'h',checkIn:'2027-01-01',checkOut:'2027-01-05'}];
 const row=(id,nights)=>({id,hotelId:'h',nights,cost:{amount:100,currency:'MXN'}});
 for(const expenses of [[row('a',2),row('b',2)],[row('a',4),row('b',4)],[row('a',2),row('b',null)]])assert.deepEqual(check({hotels,expenses},false),[]);
 assert.ok(check({hotels,expenses:[row('a',5)]},false).length);
});

const {trips:scoped}=require('./catalog.cjs');
const trips=scoped.map(x=>x.trip);
function reconcile(trip){
 const days=Array.isArray(trip.days)?trip.days:[],expenses=trip.expenses;
 if(!days.length||!days.every(d=>Number.isFinite(d?.spend)))return {skip:'Sin totales diarios completos'};
 if(!Array.isArray(expenses)||!expenses.every(e=>Number.isFinite(e?.cost?.amount)))return {skip:'Partidas pendientes o ausentes'};
 if(expenses.some(e=>e.cost.currency!=='MXN'||e.nights||e.dates||e.optional||e.hotelId))return {skip:'Ledger estructurado: conciliación en suite funcional'};
 const errors=[];
 for(const day of days){const expected=expenses.filter(e=>e.date===day.date).reduce((sum,e)=>sum+e.cost.amount,0);if(Math.abs(day.spend-expected)>=.01)errors.push(day.date+': total diario');}
 if(Math.abs(days.reduce((s,d)=>s+d.spend,0)-expenses.reduce((s,e)=>s+e.cost.amount,0))>=.01)errors.push('Total global');
 return {errors};
}
test('Conciliación de totales declarados: escenarios aplicables y exclusiones visibles',t=>{for(const trip of trips){const result=reconcile(trip);if(result.skip)t.diagnostic(trip.id+': '+result.skip);else assert.deepEqual(result.errors,[],trip.id);}});
test('Conciliación simple: detecta diferencia diaria y global; no inventa conversión',()=>{const sample={days:[{date:'2027-01-01',spend:100}],expenses:[{date:'2027-01-01',cost:{amount:100,currency:'MXN'}}]};assert.deepEqual(reconcile(sample).errors,[]);sample.days[0].spend=90;assert.equal(reconcile(sample).errors.length,2);sample.expenses[0].cost.currency='EUR';assert.ok(reconcile(sample).skip);});
