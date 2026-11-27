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
   if(h&&e.nights!=null&&h.checkIn&&h.checkOut){
     const nights=(Date.parse(h.checkOut)-Date.parse(h.checkIn))/86400000;
     if(Number.isFinite(nights)&&e.nights!==nights)errors.push(problem('expenses.'+e.id+'.nights','Noches distintas del alojamiento'));
   }
 }
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
 {hotels:[{id:'h',checkIn:'2027-01-01',checkOut:'2027-01-03'}],expenses:[{id:'e',hotelId:'h',nights:1}]},
 {expenses:[{id:'e',cost:{amount:-1,currency:'MXN'}}]},
 {exchangeRates:{EUR:0}},
 {majorTransport:[{id:'t',budgetIncludedIn:'missing'}]},
 {majorTransport:[{id:'t',budgetIncludedIn:'t'}]}
],{complete:true});
