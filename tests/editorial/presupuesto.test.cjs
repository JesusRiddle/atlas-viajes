'use strict';
const {suite,relationErrors,problem}=require('./section.cjs');
function check(t,c){
 const errors=relationErrors(t,['expenses','exchangeRates','exchangeRateSnapshot','travelerCount'],c);
 const items=Array.isArray(t.majorTransport)?t.majorTransport:[];
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
 {expenses:[{id:'e',cost:{amount:-1,currency:'MXN'}}]},
 {exchangeRates:{EUR:0}},
 {majorTransport:[{id:'t',budgetIncludedIn:'missing'}]},
 {majorTransport:[{id:'t',budgetIncludedIn:'t'}]}
],{complete:true});
