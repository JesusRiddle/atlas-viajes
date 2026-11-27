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
test('cuando un viaje declara totales diarios, concilia exactamente con sus gastos', () => {
  for (const trip of trips) {
    if (!trip.days?.length || !trip.days.every(d => Number.isFinite(d.spend))) continue;
    if (trip.expenses?.some(e=>e.cost?.currency!=='MXN'||e.nights||e.dates||e.optional||e.hotelId)) continue;
    if (!Array.isArray(trip.expenses)||!trip.expenses.every(e => Number.isFinite(e.cost?.amount))) continue;
    for (const day of trip.days) {
      const expected = trip.expenses.filter(e => e.date === day.date)
        .reduce((sum, e) => sum + e.cost.amount, 0);
      assert.ok(Math.abs(day.spend - expected) < 0.01,
        trip.id + ': total diario desajustado: ' + day.date);
    }
    const daily = trip.days.reduce((sum, d) => sum + d.spend, 0);
    const expenses = trip.expenses.reduce((sum, e) => sum + e.cost.amount, 0);
    assert.ok(Math.abs(daily - expenses) < 0.01,
      trip.id + ': total global distinto de la suma de jornadas');
  }
});

